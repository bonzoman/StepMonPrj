package com.bnz.stepmon.biz;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 1분 주기 Silent Push 배치 스케줄러
 *
 * 발송 조건: is_active=1, is_notification_enabled=1, push_fail_count < 5
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PushScheduler {

    private final ApnsService apnsService;
    private final com.bnz.stepmon.biz.spec.MyTelegramBot myTelegramBot;
    // ✅ 동시 실행 방지 플래그
    private final AtomicBoolean isRunning = new AtomicBoolean(false);
    // ✅ 최초 1회 실행 확인용 플래그
    private final AtomicBoolean isFirstRun = new AtomicBoolean(true);
    // 마지막 스케줄러 실행 시각 저장 (null이면 아직 한 번도 실행 안 됨)
    private volatile Instant lastRunTime = null;

    /**
     * 5분 후 매 5분마다 실행
     * - 발송 대상 기기 조회 후 Silent Push 전송
     * - 성공: last_push_at 갱신
     * - 실패: push_fail_count 증가
     */
    @Scheduled(initialDelayString = "PT5M", fixedDelayString = "PT5M")
    public void schedulePush() {
        // 이미 실행 중이면 스킵 (중복 실행 방어)
        if (!isRunning.compareAndSet(false, true)) {
            log.warn("[PushScheduler] ⚠️ 이미 배치가 실행 중이어서 이번 주기는 스킵합니다.");
            return;
        }

        try {
            lastRunTime = Instant.now(); // 실행 시각 갱신
            log.info("[PushScheduler] ✅✅✅ 배치 시작 (lastRunTime: {})", lastRunTime);

            // 🚀 서버 기동 후 최초 1차 실행 시에만 타는 특별한 로직
            if (isFirstRun.compareAndSet(true, false)) {
                log.info("[PushScheduler] 🌟 서버 구동 후 최초 1회 실행입니다! (초기 파라미터 세팅 등)");
                // 최초 1회에만 텔레그램 메시지 발송
                myTelegramBot.send("🚀 StepMon 서버가 성공적으로 기동되어 푸시 스케줄러가 시작되었습니다.");
            }

            Map<String, Object> data = Map.of(
                    "reason", "stepcheck");
            apnsService.sendSilentToAll(data);

            log.info("[PushScheduler] 배치 완료 ✅✅✅");
        } catch (Exception e) {
            log.error("[PushScheduler] 배치 오류", e);
            myTelegramBot.send("🚨 [PushScheduler] 배치 오류 발생: " + getErrorMessage(e));
        } finally {
            isRunning.set(false); // 플래그 반납
        }
    }

    /**
     * 스케줄러 헬스 체크 및 자동 복구 (10분 후 5분마다 실행)
     * 만약 메인 스케줄러(schedulePush)가 10분 이상 실행되지 않았다면
     * 런타임 예외 등으로 스레드가 멈춘 것으로 간주하고 강제로 일깨움
     */
    @Scheduled(initialDelayString = "PT10M", fixedDelayString = "PT5M")
    public void healthCheckAndRecover() {
        // 메인 스케줄러가 한 번도 실행되지 않았다면 경보를 울리지 않음
        if (lastRunTime == null) {
            log.debug("[PushScheduler-Monitor] ✅ 메인 스케줄러 대기 중 (initialDelay 기간)");
            return;
        }

        long minutesSinceLastRun = ChronoUnit.MINUTES.between(lastRunTime, Instant.now());

        if (minutesSinceLastRun >= 10) {
            log.error("[PushScheduler-Monitor] 🚨 메인 스케줄러가 {}분 동안 실행되지 않았습니다! 강제 복구(수동 실행)를 시도합니다.",
                    minutesSinceLastRun);
            myTelegramBot
                    .send("⚠️ [PushScheduler-Monitor] 메인 스케줄러가 " + minutesSinceLastRun + "분 동안 실행되지 않아 강제 복구를 시도합니다.");
            schedulePush();
        } else {
            log.debug("[PushScheduler-Monitor] ✅ 메인 스케줄러 정상 동작 중 (마지막 실행: {}분 전)", minutesSinceLastRun);
        }
    }

    /**
     * 매일 새벽 3시(UTC) - 90일 이상 미접속 기기 일괄 비활성 처리
     */
    @Scheduled(cron = "0 0 3 * * *")
    public void dailyCleanup() {
        log.info("[DailyCleanup] 미접속 기기 비활성 처리 시작");
        try {
            int count = apnsService.deactivateInactiveDevices();
            log.info("[DailyCleanup] 비활성 처리 완료: {}건 (90일 이상 미접속)", count);
            if (count > 0) {
                myTelegramBot.send("🧹 [DailyCleanup] 미접속 기기 " + count + "건을 비활성 처리했습니다. (기준: 90일)");
            }
        } catch (Exception e) {
            log.error("[DailyCleanup] 미접속 기기 비활성 처리 오류", e);
            myTelegramBot.send("🚨 [DailyCleanup] 미접속 기기 비활성 처리 오류: " + getErrorMessage(e));
        }
    }

    /**
     * 예외 객체에서 실질적인 에러 메시지를 추출 (재귀적으로 Cause 탐색)
     */
    private String getErrorMessage(Throwable e) {
        if (e == null) {
            return "알 수 없는 오류";
        }

        String msg = e.getMessage();
        if (msg != null && !msg.trim().isEmpty()) {
            return msg;
        }

        if (e.getCause() != null) {
            return getErrorMessage(e.getCause());
        }

        return e.toString();
    }
}
