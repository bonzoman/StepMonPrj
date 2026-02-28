package com.bnz.stepmon.biz.spec;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "디바이스 검색 조건")
public record DeviceSearchReqDto(
        @Schema(description = "앱 설치 식별자(UUID) - 부분 일치", example = "11111111") String installId,

        @Schema(description = "디바이스 토큰 - 부분 일치", example = "abcd1234") String deviceToken,

        @Schema(description = "알림 허용 여부", example = "true") Boolean isNotificationEnabled,

        @Schema(description = "활성 상태 여부", example = "true") Boolean isActive) {
}
