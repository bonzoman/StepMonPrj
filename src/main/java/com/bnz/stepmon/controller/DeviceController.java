package com.bnz.stepmon.controller;

import com.bnz.stepmon.biz.DeviceService;
import com.bnz.stepmon.biz.spec.DeviceRegisterReqDto;
import com.bnz.stepmon.biz.spec.DeviceSettingsReqDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Device", description = "디바이스 등록/설정/조회 API.4")
@RestController
@RequiredArgsConstructor
public class DeviceController {

        private final DeviceService deviceService;

        @Operation(summary = "디바이스 토큰 등록/갱신", description = "installId 기준으로 디바이스 토큰을 등록하거나 갱신합니다.")
        @PostMapping("/api/device/register")
        public ResponseEntity<?> register(
                        @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true, description = "디바이스 등록 요청 정보", content = @Content(schema = @Schema(implementation = DeviceRegisterReqDto.class), examples = @ExampleObject(name = "iOS 등록 예시", value = """
                                        {
                                          "installId": "11111111-2222-3333-4444-555555555555",
                                          "deviceToken": "abcd1234ef567890abcd1234ef567890",
                                          "isNotificationEnabled": true,
                                          "startMinutes": 480,
                                          "endMinutes": 1320,
                                          "timeZone": "Asia/Seoul",
                                          "appVersion": "1.0.0",
                                          "sentAt": "2026-02-16T12:00:00Z"
                                        }
                                        """))) @Valid @RequestBody DeviceRegisterReqDto req) {
                deviceService.upsert(req);
                return ResponseEntity.ok().build();
        }

        @Operation(summary = "알림 설정 저장", description = "installId 기준으로 알림 활성화 여부 및 타임존을 저장합니다.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "저장 성공"),
                        @ApiResponse(responseCode = "400", description = "요청값 검증 실패", content = @Content),
                        @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
        })
        @PostMapping("/api/device/settings")
        public ResponseEntity<?> saveSettings(
                        @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true, description = "알림 설정 저장 요청", content = @Content(schema = @Schema(implementation = DeviceSettingsReqDto.class), examples = {
                                        @ExampleObject(name = "한국 사용자 예시", summary = "Asia/Seoul 사용자 설정 예시", value = """
                                                        {
                                                          "installId": "123e4567-e89b-12d3-a456-426614174000",
                                                          "isNotificationEnabled": true,
                                                          "startMinutes": 480,
                                                          "endMinutes": 1320,
                                                          "timeZone": "Asia/Seoul",
                                                          "sentAt": "2026-02-16T11:32:00Z"
                                                        }
                                                        """)
                        }

                        )) @Valid @RequestBody DeviceSettingsReqDto req) {
                deviceService.updateSettings(req);
                return ResponseEntity.ok().build();
        }

        // @Operation(summary = "디바이스 목록 검색", description = "다양한 조건으로 디바이스 목록을 검색합니다.")
        // @PostMapping("/api/device/search")
        // public ResponseEntity<List<DeviceResDto>> search(@ParameterObject
        // DeviceSearchReqDto req) {
        // return ResponseEntity.ok(deviceService.searchDevices(req));
        // }
}