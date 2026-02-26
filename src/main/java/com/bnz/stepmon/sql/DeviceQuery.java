package com.bnz.stepmon.sql;


import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface DeviceQuery {

    // ✅ 같은 토큰을 가진 "다른 install_id" 행을 비활성 처리
    @Update("""
        UPDATE device_registration
        SET is_active = 0,
            deactivated_at = NOW(3),
            deactivated_reason = 'DUP_TOKEN'
        WHERE device_token = #{deviceToken}
          AND install_id <> #{installId}
          AND is_active = 1
        """)
    int deactivateSameTokenOtherInstall(@Param("deviceToken") String deviceToken,
                                        @Param("installId") String installId);

    // ✅ 업서트(등록/갱신)
    @Insert("""
        INSERT INTO device_registration
          (install_id, device_token, is_notification_enabled, platform, app_version,
           first_seen_at, last_seen_at, is_active, deactivated_at, deactivated_reason)
        VALUES
          (#{installId}, #{deviceToken}, #{isNotificationEnabled}, #{platform}, #{appVersion},
           NOW(3), NOW(3), 1, NULL, NULL)
        ON DUPLICATE KEY UPDATE
          device_token = VALUES(device_token),
          is_notification_enabled = VALUES(is_notification_enabled),
          platform = VALUES(platform),
          app_version = VALUES(app_version),
          last_seen_at = NOW(3),
          is_active = 1,
          deactivated_at = NULL,
          deactivated_reason = NULL,
          invalid_count = 0,
          is_optout = 0
        """)
    int upsert(@Param("installId") String installId,
               @Param("deviceToken") String deviceToken,
               @Param("isNotificationEnabled") int isNotificationEnabled,
               @Param("platform") String platform,
               @Param("appVersion") String appVersion);


    @Update("""
    UPDATE device_registration
    SET is_notification_enabled = #{isNotificationEnabled},
        start_minutes = #{startMinutes},
        end_minutes = #{endMinutes},
        time_zone = #{timeZone}
    WHERE install_id = #{installId}
    """)
    int updateSettings(@Param("installId") String installId,
                       @Param("isNotificationEnabled") int isNotificationEnabled,
                       @Param("startMinutes") int startMinutes,
                       @Param("endMinutes") int endMinutes,
                       @Param("timeZone") String timeZone);
}
