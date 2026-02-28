package com.bnz.stepmon.biz.spec;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.time.OffsetDateTime;

@Builder
@Schema(description = "디바이스 상세 정보 응답")
public record DeviceResDto(
        @Schema(description = "앱 설치 식별자(UUID)", example = "11111111-2222-3333-4444-555555555555") String installId,

        @Schema(description = "APNs 디바이스 토큰", example = "abcd1234ef567890abcd1234ef567890") String deviceToken,

        @Schema(description = "알림 허용 여부", example = "true") boolean isNotificationEnabled,

        @Schema(description = "앱 버전", example = "1.0.5") String appVersion,

        @Schema(description = "마지막 푸시 성공 시각") OffsetDateTime lastPushAt,

        @Schema(description = "푸시 발송 실패 횟수", example = "0") int pushFailCount,

        @Schema(description = "활성 상태 여부", example = "true") boolean isActive,

        @Schema(description = "비활성 처리 시각") OffsetDateTime deactivatedAt,

        @Schema(description = "비활성 사유", example = "DUP_TOKEN") String deactivatedReason,

        @Schema(description = "최초 등록 시각") OffsetDateTime firstSeenAt,

        @Schema(description = "마지막 토큰 갱신 시각") OffsetDateTime lastSeenAt) {
}
