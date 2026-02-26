package com.bnz.stepmon.config;

import com.eatthepath.pushy.apns.ApnsClient;
import com.eatthepath.pushy.apns.ApnsClientBuilder;
import com.eatthepath.pushy.apns.auth.ApnsSigningKey;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;

@Configuration
public class ApnsConfig {

    @Bean
    @ConfigurationProperties(prefix = "apns")
    public ApnsProperties apnsProperties() {
        return new ApnsProperties();
    }

    @Bean(destroyMethod = "close")
    public ApnsClient apnsClient(ApnsProperties props) throws Exception {
        final String host = props.isUseSandbox()
                ? ApnsClientBuilder.DEVELOPMENT_APNS_HOST
                : ApnsClientBuilder.PRODUCTION_APNS_HOST;

        final ApnsSigningKey signingKey = ApnsSigningKey.loadFromPkcs8File(
                new File(props.getP8Path()),
                props.getTeamId(),
                props.getKeyId()
        );

        return new ApnsClientBuilder()
                .setApnsServer(host)
                .setSigningKey(signingKey)
                .build();
    }
}
