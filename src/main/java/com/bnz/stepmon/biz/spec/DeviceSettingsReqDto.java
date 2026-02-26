package com.bnz.stepmon.biz.spec;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record DeviceSettingsReqDto(
        @NotBlank String installId,
        @NotNull Boolean isNotificationEnabled,
        @NotNull @Min(0) @Max(1439) Integer startMinutes,
        @NotNull @Min(0) @Max(1439) Integer endMinutes,
        @NotBlank String timeZone,
        String sentAt
) {}
