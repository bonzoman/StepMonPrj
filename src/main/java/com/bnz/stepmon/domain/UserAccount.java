package com.bnz.stepmon.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAccount {
    private String userId;
    private String password;
    private String userName;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
