package com.bnz.stepmon.biz.spec;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "디바이스 검색 조건")
public class DeviceSearchReqDto {
        @Schema(description = "앱 설치 식별자(UUID) - 부분 일치", example = "11111111")
        private String installId;

        @Schema(description = "디바이스 토큰 - 부분 일치", example = "abcd1234")
        private String deviceToken;

        @Schema(description = "알림 허용 여부", example = "true")
        private Boolean isNotificationEnabled;

        @Schema(description = "활성 상태 여부", example = "true")
        private Boolean isActive;

        @Schema(description = "최초 등록 시작일", example = "2024-01-01T00:00:00Z")
        private String firstSeenStart;

        @Schema(description = "최초 등록 종료일", example = "2024-12-31T23:59:59Z")
        private String firstSeenEnd;

        @Schema(description = "마지막 접속 시작일", example = "2024-01-01T00:00:00Z")
        private String lastSeenStart;

        @Schema(description = "마지막 접속 종료일", example = "2024-12-31T23:59:59Z")
        private String lastSeenEnd;

        @JsonProperty("pageNumber")
        @Schema(description = "페이지 번호 (0부터 시작)", example = "0")
        private Integer page;

        @JsonProperty("pageSize")
        @Schema(description = "페이지 크기", example = "30")
        private Integer size;

        public int getPageNumber() {
                return page == null ? 0 : page;
        }

        public int getPageSize() {
                return size == null ? 30 : size;
        }

        public int getOffset() {
                return getPageNumber() * getPageSize();
        }
}
