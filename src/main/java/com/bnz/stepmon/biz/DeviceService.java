package com.bnz.stepmon.biz;

import com.bnz.stepmon.biz.spec.DeviceRegisterReqDto;
import com.bnz.stepmon.biz.spec.DeviceSettingsReqDto;
import com.bnz.stepmon.sql.DeviceQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeviceService {
    private final DeviceQuery deviceQuery;

    @Transactional
    public void upsert(DeviceRegisterReqDto req) {
        String appVersion = (req.appVersion() == null || req.appVersion().isBlank()) ? "unknown" : req.appVersion();

        // ✅ 1) 같은 토큰이 다른 install_id에 있으면 비활성 처리
        deviceQuery.deactivateSameTokenOtherInstall(req.deviceToken(), req.installId());

        // ✅ 2) 내 install_id 행 업서트(활성화 포함)
        deviceQuery.upsert(
                req.installId(),
                req.deviceToken(),
                req.isNotificationEnabled() ? 1 : 0,
                appVersion);
    }

    @Transactional
    public void updateSettings(DeviceSettingsReqDto req) {
        deviceQuery.updateSettings(
                req.installId(),
                req.isNotificationEnabled() ? 1 : 0);

        // ✅ 선택: install_id row가 아직 없으면(=register 안 됨) 업데이트 0건
        // 여기서 에러로 막고 싶으면 예외 던지면 됨.
        // if (updated == 0) throw new IllegalStateException("device not registered yet:
        // " + req.installId());
    }


    @Transactional(readOnly = true)
    public java.util.List<com.bnz.stepmon.biz.spec.DeviceResDto> searchDevices(
            com.bnz.stepmon.biz.spec.DeviceSearchReqDto req) {
        return deviceQuery.searchPaging(req);
    }

    @Transactional(readOnly = true)
    public long countDevices(com.bnz.stepmon.biz.spec.DeviceSearchReqDto req) {
        return deviceQuery.count(req);
    }
}