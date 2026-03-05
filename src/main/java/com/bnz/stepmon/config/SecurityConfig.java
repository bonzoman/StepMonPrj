package com.bnz.stepmon.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable()) // HTTPS 환경에서 POST 요청이 차단되지 않도록 CSRF 비활성화
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // 현재 모든 요청 허용 상태 유지
                )
                .headers(headers -> headers
                        .frameOptions(frame -> frame.sameOrigin()) // H2 콘솔이나 iFrame 사용 대비
                );

        // 다른버전
        // @see
        // https://velog.io/@woosim34/Spring-Spring-Security-설정-및-구현SessionSpring-boot3.0-이상

        // http
        // .csrf((csrfConfig) -> csrfConfig.disable()) // 1번
        // .csrf(AbstractHttpConfigurer::disable) // 1번(Lambda)
        // .headers((headerConfig) -> headerConfig.frameOptions(frameOptionsConfig ->
        // frameOptionsConfig.disable()))// 2번
        // .headers((headerConfig) ->
        // headerConfig.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))//
        // 2번(Lambda)
        // .authorizeHttpRequests((auth) ->
        // auth
        // .requestMatchers(PathRequest.toH2Console()).permitAll()
        // .requestMatchers("/**").permitAll()
        // .requestMatchers("/", "/v3/**","/swagger-ui/**","/login/**").permitAll()
        // .requestMatchers("/posts/**", "/api/v1/posts/**").hasRole(Role.USER.name())
        // .requestMatchers("/admins/**",
        // "/api/v1/admins/**").hasRole(Role.ADMIN.name())
        // .anyRequest().authenticated()
        // )// 3번
        // .exceptionHandling((exceptionConfig) ->
        // exceptionConfig.authenticationEntryPoint(unauthorizedEntryPoint).accessDeniedHandler(accessDeniedHandler)
        // ) // 401 403 관련 예외처리
        ;

        return http.build();
    }

    // private final AuthenticationEntryPoint unauthorizedEntryPoint =
    // (request, response, authException) -> {
    // ErrorResponse fail = new ErrorResponse(HttpStatus.UNAUTHORIZED, "Spring
    // security unauthorized...111");
    // response.setStatus(HttpStatus.UNAUTHORIZED.value());
    // String json = new ObjectMapper().writeValueAsString(fail);
    // response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    // PrintWriter writer = response.getWriter();
    // writer.write(json);
    // writer.flush();
    // };
    //
    // private final AccessDeniedHandler accessDeniedHandler =
    // (request, response, accessDeniedException) -> {
    // ErrorResponse fail = new ErrorResponse(HttpStatus.FORBIDDEN, "Spring security
    // forbidden...222");
    // response.setStatus(HttpStatus.FORBIDDEN.value());
    // String json = new ObjectMapper().writeValueAsString(fail);
    // response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    // PrintWriter writer = response.getWriter();
    // writer.write(json);
    // writer.flush();
    // };

    // @Getter
    // @RequiredArgsConstructor
    // public class ErrorResponse {
    //
    // private final HttpStatus status;
    // private final String message;
    // }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
