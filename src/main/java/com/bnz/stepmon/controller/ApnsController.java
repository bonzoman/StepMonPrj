package com.bnz.stepmon.controller;

import com.bnz.stepmon.biz.ApnsService;
import com.bnz.stepmon.sql.DeviceQuery;
import com.eatthepath.pushy.apns.PushNotificationResponse;
import com.eatthepath.pushy.apns.util.SimpleApnsPushNotification;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/apns")
public class ApnsController {

        private final ApnsService apnsService;
        private final DeviceQuery deviceQuery;

        @PostMapping("/silent")
        @Operation(summary = "Silent Push 전송 (단건)", description = "APNs로 background silent push를 단건 전송합니다.")
        public ResponseEntity<?> silent(
                        @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Silent Push 요청 바디", required = true, content = @Content(schema = @Schema(implementation = SilentPushRequest.class), examples = @ExampleObject(name = "silentExample", value = """
                                        {
                                          "deviceToken": "db5578571849940ef0f0a2b8430c0df985d6e0ed906ccf907c08e58e0aa4412e",
                                          "data": {
                                            "reason": "stepcheck",
                                            "ts": 1730000000
                                          }
                                        }
                                        """))) @RequestBody SilentPushRequest req)
                        throws Exception {

                PushNotificationResponse<SimpleApnsPushNotification> res = apnsService
                                .sendSilent(req.deviceToken(), req.data()).get();

                if (res.isAccepted()) {
                        // ✅ 성공 시 last_push_at 갱신
                        deviceQuery.updateLastPushAt(req.deviceToken());
                        return ResponseEntity.ok(Map.of(
                                        "accepted", true,
                                        "apnsId", String.valueOf(res.getApnsId())));
                }

                // ✅ 실패 시 push_fail_count 증가
                String reason = res.getRejectionReason().orElse("unknown");
                deviceQuery.incrementPushFailCount(req.deviceToken());
                return ResponseEntity.badRequest().body(Map.of(
                                "accepted", false,
                                "rejectionReason", reason,
                                "apnsId", String.valueOf(res.getApnsId())));
        }

        public record SilentPushRequest(String deviceToken, Map<String, Object> data) {
        }
}