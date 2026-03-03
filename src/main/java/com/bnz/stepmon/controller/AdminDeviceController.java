package com.bnz.stepmon.controller;

import com.bnz.stepmon.biz.DeviceService;
import com.bnz.stepmon.biz.spec.DeviceResDto;
import com.bnz.stepmon.biz.spec.DeviceSearchReqDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@Slf4j
@Tag(name = "Admin UI", description = "관리자 전용 화면 및 비동기 테이블 렌더링 API")
@Controller
@RequiredArgsConstructor
public class AdminDeviceController {

    private final DeviceService deviceService;

    /**
     * 메인 검색 페이지 반환
     */
    @Operation(summary = "디바이스 검색 메인 화면", description = "디바이스 목록 조회를 위한 HTML 메인 페이지를 반환합니다.", operationId = "showAdminDevicesIndex")
    @GetMapping("/admin/devices")
    public String index(Model model) {
        DeviceSearchReqDto req = DeviceSearchReqDto.builder()
                .page(0)
                .size(30)
                .build();

        model.addAttribute("searchReq", req);
        model.addAttribute("totalCount", 0);
        model.addAttribute("devices", List.of());
        return "admin/devices";
    }

    /**
     * HTMX(Form-urlencoded) 전송용 엔드포인트
     */
    @Operation(hidden = true)
    @PostMapping(value = "/admin/devices/table", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public String searchTableForm(DeviceSearchReqDto req, Model model) {
        return performSearch(req, model);
    }

    /**
     * Swagger 테스트용 GET 엔드포인트
     * POST Body 요청이 Swagger UI에서 먹통인 경우를 대비해 GET 방식으로 분리
     */
    @Operation(summary = "디바이스 검색 테이블 데이터 (GET)", description = "쿼리 파라미터를 기반으로 검색 결과 테이블 HTML 프래그먼트를 반환합니다.", operationId = "searchDevicesTableGet")
    @ApiResponse(responseCode = "200", description = "HTML 테이블 프래그먼트 반환", content = @Content(mediaType = MediaType.TEXT_HTML_VALUE, schema = @Schema(type = "string")))
    @GetMapping(value = "/admin/devices/table/search", produces = MediaType.TEXT_HTML_VALUE)
    public String searchTableGet(@ParameterObject DeviceSearchReqDto req, Model model) {
        return performSearch(req, model);
    }

    /**
     * 공통 검색 처리 로직
     */
    private String performSearch(DeviceSearchReqDto req, Model model) {
        // null 방지 및 기본값 보정
        if (req == null)
            req = new DeviceSearchReqDto();
        if (req.getPage() == null)
            req.setPage(0);
        if (req.getSize() == null || req.getSize() <= 0)
            req.setSize(30);

        log.debug("[AdminDeviceController] Search Request: {}", req);

        try {
            List<DeviceResDto> devices = deviceService.searchDevices(req);
            long totalCount = deviceService.countDevices(req);

            model.addAttribute("devices", devices);
            model.addAttribute("totalCount", totalCount);
            model.addAttribute("searchReq", req);
        } catch (Exception e) {
            log.error("[AdminDeviceController] Search failed", e);
            model.addAttribute("devices", List.of());
            model.addAttribute("totalCount", 0);
            model.addAttribute("searchReq", req);
            model.addAttribute("errorMessage", e.getMessage());
        }

        return "admin/fragments/device-table :: device-table";
    }
}
