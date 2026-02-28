package com.bnz.stepmon.biz.spec;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import java.time.OffsetDateTime;

@Builder
public record DeviceRegisterReqDto(
        @NotBlank String installId,
        @NotBlank String deviceToken,
        @NotNull Boolean isNotificationEnabled,
        String appVersion,
        OffsetDateTime sentAt) {
}