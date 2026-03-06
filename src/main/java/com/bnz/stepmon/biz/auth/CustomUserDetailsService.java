package com.bnz.stepmon.biz.auth;

import com.bnz.stepmon.domain.UserAccount;
import com.bnz.stepmon.sql.UserAccountQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserAccountQuery userAccountQuery;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserAccount userAccount = userAccountQuery.findByUserId(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return User.builder()
                .username(userAccount.getUserId())
                .password(userAccount.getPassword())
                .roles(userAccount.getRole().replace("ROLE_", ""))
                .build();
    }
}
