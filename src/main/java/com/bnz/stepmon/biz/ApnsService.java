package com.bnz.stepmon.biz;

import com.bnz.stepmon.biz.spec.PushTargetDto;
import com.bnz.stepmon.config.ApnsProperties;
import com.eatthepath.pushy.apns.ApnsClient;
import com.eatthepath.pushy.apns.DeliveryPriority;
import com.eatthepath.pushy.apns.PushNotificationResponse;
import com.eatthepath.pushy.apns.PushType;
import com.eatthepath.pushy.apns.util.SimpleApnsPayloadBuilder;
import com.eatthepath.pushy.apns.util.SimpleApnsPushNotification;
import com.eatthepath.pushy.apns.util.TokenUtil;
import com.bnz.stepmon.sql.DeviceQuery;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApnsService {
    private final ApnsClient apnsClient;
    private final ApnsProperties props;
    private final DeviceQuery deviceQuery;

    /**
     * 단건 Silent Push 발송 (수동 API용)
     */
    public CompletableFuture<PushNotificationResponse<SimpleApnsPushNotification>> sendSilent(
            String rawDeviceToken,
            Map<String, Object> customData) {
        final String token = TokenUtil.sanitizeTokenString(rawDeviceToken);

        SimpleApnsPayloadBuilder payloadBuilder = new SimpleApnsPayloadBuilder();
        payloadBuilder.setContentAvailable(true);

        if (customData != null) {
            customData.forEach(payloadBuilder::addCustomProperty);
        }

        final String payload = payloadBuilder.build();

        final SimpleApnsPushNotification notification = new SimpleApnsPushNotification(
                token,
                props.getTopic(),
                payload,
                Instant.now().plusSeconds(60),
                DeliveryPriority.CONSERVE_POWER,
                PushType.BACKGROUND,
                null,
                null);

        return apnsClient.sendNotification(notification);
    }

    /**
     * 배치용 - 발송 대상 전체에 Silent Push 발송
     * push_fail_count < 5 인 is_active=1, is_notification_enabled=1 기기 대상
     */
    public void sendSilentToAll(Map<String, Object> customData) {
        List<PushTargetDto> targets = deviceQuery.findPushTargets();
        log.info("[배치] 발송 대상 {}건", targets.size());

        if (targets.isEmpty()) {
            return;
        }

        List<CompletableFuture<PushResult>> futures = new ArrayList<>();

        for (PushTargetDto target : targets) {
            CompletableFuture<PushResult> future = sendSilent(target.deviceToken(), customData)
                    .handle((res, ex) -> {
                        if (ex != null) {
                            log.error("[배치] APNs 오류 installId={}", target.installId(), ex);
                            return new PushResult(target.deviceToken(), false);
                        } else if (res.isAccepted()) {
                            return new PushResult(target.deviceToken(), true);
                        } else {
                            String reason = res.getRejectionReason().orElse("unknown");
                            log.warn("[배치] 실패 installId={} reason={}", target.installId(), reason);
                            return new PushResult(target.deviceToken(), false);
                        }
                    });
            futures.add(future);
        }

        // 모든 푸시 발송 완료 대기 (최대 2분 타임아웃 설정)
        try {
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                    .get(2, TimeUnit.MINUTES);
        } catch (TimeoutException e) {
            log.warn("[배치] 전체 푸시 발송 대기 중 타임아웃 발생 (2분 경과). 완료된 건만 처리합니다.");
        } catch (Exception e) {
            log.error("[배치] 푸시 결과 수집 중 예외 발생", e);
        }

        // 결과 수집 (완료된 것만 추출)
        List<PushResult> results = futures.stream()
                .filter(CompletableFuture::isDone)
                .map(f -> {
                    try {
                        return f.getNow(new PushResult(null, false));
                    } catch (Exception e) {
                        return new PushResult(null, false);
                    }
                })
                .filter(r -> r.token() != null)
                .toList();

        List<String> successTokens = results.stream()
                .filter(PushResult::success)
                .map(PushResult::token)
                .toList();

        List<String> failTokens = results.stream()
                .filter(r -> !r.success())
                .map(PushResult::token)
                .toList();

        log.info("[배치] 응답 수신 완료. 성공: {}건, 실패: {}건", successTokens.size(), failTokens.size());

        // DB 벌크 업데이트 (IN 쿼리가 너무 길어지는 것을 방지하기 위해 chunkSize 1000개 단위 분할)
        final int batchSize = 1000;

        for (int i = 0; i < successTokens.size(); i += batchSize) {
            List<String> batch = successTokens.subList(i, Math.min(successTokens.size(), i + batchSize));
            deviceQuery.updateLastPushAtBatch(batch);
        }

        for (int i = 0; i < failTokens.size(); i += batchSize) {
            List<String> batch = failTokens.subList(i, Math.min(failTokens.size(), i + batchSize));
            deviceQuery.incrementPushFailCountBatch(batch);
        }
    }

    private record PushResult(String token, boolean success) {
    }
}