package com.bnz.stepmon.sql;

import com.bnz.stepmon.biz.spec.DeviceResDto;
import com.bnz.stepmon.biz.spec.PushTargetDto;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface DeviceQuery {

    // ✅ 같은 토큰을 가진 "다른 install_id" 행을 비활성 처리
    @Update("""
            UPDATE device_registration
            SET is_active = 0,
                deactivated_at = UTC_TIMESTAMP(3),
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
              (install_id, device_token, is_notification_enabled, start_minutes, end_minutes, time_zone,
               app_version, last_push_at, push_fail_count, is_active, deactivated_at, deactivated_reason,
               first_seen_at, last_seen_at)
            VALUES
              (#{installId}, #{deviceToken}, #{isNotificationEnabled}, #{startMinutes}, #{endMinutes}, #{timeZone},
               #{appVersion}, NULL, 0, 1, NULL, NULL, UTC_TIMESTAMP(3), UTC_TIMESTAMP(3))
            ON DUPLICATE KEY UPDATE
              device_token = VALUES(device_token),
              is_notification_enabled = VALUES(is_notification_enabled),
              start_minutes = VALUES(start_minutes),
              end_minutes = VALUES(end_minutes),
              time_zone = VALUES(time_zone),
              app_version = VALUES(app_version),
              is_active = 1,
              deactivated_at = NULL,
              deactivated_reason = NULL,
              push_fail_count = 0,
              last_seen_at = UTC_TIMESTAMP(3)
            """)
    int upsert(@Param("installId") String installId,
            @Param("deviceToken") String deviceToken,
            @Param("isNotificationEnabled") int isNotificationEnabled,
            @Param("startMinutes") Integer startMinutes,
            @Param("endMinutes") Integer endMinutes,
            @Param("timeZone") String timeZone,
            @Param("appVersion") String appVersion);

    // ✅ 알림 설정 갱신
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
            @Param("startMinutes") Integer startMinutes,
            @Param("endMinutes") Integer endMinutes,
            @Param("timeZone") String timeZone);

    // ✅ 푸시 발송 성공 시 last_push_at 갱신
    @Update("""
            UPDATE device_registration
            SET last_push_at = UTC_TIMESTAMP(3)
            WHERE device_token = #{deviceToken}
              AND is_active = 1
            """)
    int updateLastPushAt(@Param("deviceToken") String deviceToken);

    // ✅ 푸시 발송 실패 시 push_fail_count 증가
    @Update("""
            UPDATE device_registration
            SET push_fail_count = push_fail_count + 1
            WHERE device_token = #{deviceToken}
              AND is_active = 1
            """)
    int incrementPushFailCount(@Param("deviceToken") String deviceToken);

    // ✅ 푸시 발송 성공 시 벌크 갱신 (배치용)
    @Update("""
            <script>
            UPDATE device_registration
            SET last_push_at = UTC_TIMESTAMP(3)
            WHERE is_active = 1
              AND device_token IN
              <foreach item='token' collection='tokens' open='(' separator=',' close=')'>
                  #{token}
              </foreach>
            </script>
            """)
    int updateLastPushAtBatch(@Param("tokens") List<String> tokens);

    // ✅ 푸시 발송 실패 시 벌크 증가 (배치용)
    @Update("""
            <script>
            UPDATE device_registration
            SET push_fail_count = push_fail_count + 1
            WHERE is_active = 1
              AND device_token IN
              <foreach item='token' collection='tokens' open='(' separator=',' close=')'>
                  #{token}
              </foreach>
            </script>
            """)
    int incrementPushFailCountBatch(@Param("tokens") List<String> tokens);

    // ✅ 검색 조회
    @Select("""
                <script>
                SELECT
                    install_id          as installId,
                    device_token        as deviceToken,
                    is_notification_enabled as isNotificationEnabled,
                    app_version         as appVersion,
                    last_push_at        as lastPushAt,
                    push_fail_count     as pushFailCount,
                    is_active           as isActive,
                    deactivated_at      as deactivatedAt,
                    deactivated_reason  as deactivatedReason,
                    first_seen_at       as firstSeenAt,
                    last_seen_at        as lastSeenAt,
                    time_zone           as timezone
                FROM device_registration
                <where>
                    <if test="installId != null and installId != ''">
                        AND install_id LIKE CONCAT('%', #{installId}, '%')
                    </if>
                    <if test="deviceToken != null and deviceToken != ''">
                        AND device_token LIKE CONCAT('%', #{deviceToken}, '%')
                    </if>
                    <if test="isNotificationEnabled != null">
                        AND is_notification_enabled = #{isNotificationEnabled}
                    </if>
                    <if test="isActive != null">
                        AND is_active = #{isActive}
                    </if>
                </where>
                ORDER BY last_seen_at DESC
                LIMIT 100
                </script>
            """)
    List<DeviceResDto> search(com.bnz.stepmon.biz.spec.DeviceSearchReqDto req);

    // ✅ 검색 결과 총 건수 조회
    @Select("""
                <script>
                SELECT COUNT(*)
                FROM device_registration
                <where>
                    <if test="installId != null and installId != ''">
                        AND install_id LIKE CONCAT('%', #{installId}, '%')
                    </if>
                    <if test="deviceToken != null and deviceToken != ''">
                        AND device_token LIKE CONCAT('%', #{deviceToken}, '%')
                    </if>
                    <if test="isNotificationEnabled != null">
                        AND is_notification_enabled = #{isNotificationEnabled}
                    </if>
                    <if test="isActive != null">
                        AND is_active = #{isActive}
                    </if>
                </where>
                </script>
            """)
    long count(com.bnz.stepmon.biz.spec.DeviceSearchReqDto req);

    // ✅ 검색 조회 (페이징 및 날짜 필터 제거됨)
    @Select("""
                <script>
                SELECT
                    install_id          as installId,
                    device_token        as deviceToken,
                    is_notification_enabled as isNotificationEnabled,
                    app_version         as appVersion,
                    last_push_at        as lastPushAt,
                    push_fail_count     as pushFailCount,
                    is_active           as isActive,
                    deactivated_at      as deactivatedAt,
                    deactivated_reason  as deactivatedReason,
                    first_seen_at       as firstSeenAt,
                    last_seen_at        as lastSeenAt,
                    time_zone           as timezone
                FROM device_registration
                <where>
                    <if test="installId != null and installId != ''">
                        AND install_id LIKE CONCAT('%', #{installId}, '%')
                    </if>
                    <if test="deviceToken != null and deviceToken != ''">
                        AND device_token LIKE CONCAT('%', #{deviceToken}, '%')
                    </if>
                    <if test="isNotificationEnabled != null">
                        AND is_notification_enabled = #{isNotificationEnabled}
                    </if>
                    <if test="isActive != null">
                        AND is_active = #{isActive}
                    </if>
                </where>
                ORDER BY last_seen_at DESC
                LIMIT #{pageSize} OFFSET #{offset}
                </script>
            """)
    List<DeviceResDto> searchPaging(com.bnz.stepmon.biz.spec.DeviceSearchReqDto req);

    // ✅ 1분 배치용 푸시 발송 대상 조회 (동일 기기는 20분에 1번만)
    @Select("""
                SELECT
                    install_id      as installId,
                    device_token    as deviceToken
                FROM device_registration
                      WHERE is_active = 1
                        AND is_notification_enabled = 1
                        AND push_fail_count < 5
                        AND (last_push_at IS NULL OR last_push_at <= UTC_TIMESTAMP(3) - INTERVAL 20 MINUTE)
                        AND last_seen_at >= UTC_TIMESTAMP(3) - INTERVAL 30 DAY
            """)
    List<PushTargetDto> findPushTargets();
}
