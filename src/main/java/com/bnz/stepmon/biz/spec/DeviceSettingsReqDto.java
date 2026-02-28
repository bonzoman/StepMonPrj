package com.bnz.stepmon.biz.spec;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import java.time.OffsetDateTime;

@Builder
public record DeviceSettingsReqDto(
                @NotBlank String installId,
                @NotNull Boolean isNotificationEnabled,
                OffsetDateTime sentAt) {
}
