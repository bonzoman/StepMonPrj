package com.bnz.stepmon.sql;

import com.bnz.stepmon.domain.UserAccount;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.Optional;

@Mapper
public interface UserAccountQuery {

    @Select("""
            SELECT
                user_id     as userId,
                password    as password,
                user_name   as userName,
                role        as role,
                created_at  as createdAt,
                updated_at  as updatedAt
            FROM user_account
            WHERE user_id = #{userId}
            """)
    Optional<UserAccount> findByUserId(@Param("userId") String userId);
}
