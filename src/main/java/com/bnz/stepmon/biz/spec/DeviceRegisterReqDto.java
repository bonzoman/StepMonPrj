package com.bnz.stepmon.biz.spec;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record DeviceRegisterReqDto(
        @NotBlank String installId,
        @NotBlank String deviceToken,
        @NotNull Boolean isNotificationEnabled,
        String platform,
        String appVersion,
        String sentAt
) {}