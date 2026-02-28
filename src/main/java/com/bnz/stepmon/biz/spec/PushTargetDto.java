package com.bnz.stepmon.biz.spec;

/**
 * 1분 배치 푸시 발송 대상 레코드
 */
public record PushTargetDto(
        String installId,
        String deviceToken) {
}
