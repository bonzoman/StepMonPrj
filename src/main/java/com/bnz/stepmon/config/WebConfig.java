package com.bnz.stepmon.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * mvc 추가설정(설정 커스터마이징)
 * 기본 리소스 위치 classpath: /static /public /resources /META-INF/resources
 */
@Configuration
//@EnableWebMvc 이거 붙이면 springboot가 제공하는 모든 mvc기능은 사라지고 web mvc 기능 모두 구현해야 함
public class WebConfig implements WebMvcConfigurer {

    /* 정적page 매핑 http://localhost:8888/m/hello.html
     * @see org.springframework.web.servlet.config.annotation.WebMvcConfigurer#addResourceHandlers(org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry)
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/m/**") //요청이 오면
                .addResourceLocations("classpath:/m/") //해당 디렉토리를 참조
                .setCachePeriod(20); //20초
    }

    /* CrossOrigin 설정
     * 도메인, port 등 다른 url host에 대한 요청에 대한 응답이 가능하도록
     * @see org.springframework.web.servlet.config.annotation.WebMvcConfigurer#addCorsMappings(org.springframework.web.servlet.config.annotation.CorsRegistry)
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") ////모든 요청에 대해서...
        .allowedOrigins("http://localhost:18080");//해당url에서 호출되는...
        //WebMvcConfigurer.super.addCorsMappings(registry);
    }

}
