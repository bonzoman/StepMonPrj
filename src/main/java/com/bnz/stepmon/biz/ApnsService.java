package com.bnz.stepmon.biz;

import com.bnz.stepmon.config.ApnsProperties;
import com.eatthepath.pushy.apns.ApnsClient;
import com.eatthepath.pushy.apns.DeliveryPriority;
import com.eatthepath.pushy.apns.PushNotificationResponse;
import com.eatthepath.pushy.apns.PushType;
import com.eatthepath.pushy.apns.util.SimpleApnsPayloadBuilder;
import com.eatthepath.pushy.apns.util.SimpleApnsPushNotification;
import com.eatthepath.pushy.apns.util.TokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class ApnsService {
    private final ApnsClient apnsClient;
    private final ApnsProperties props;

//    public ApnsService(ApnsClient apnsClient, ApnsProperties props) {
//        this.apnsClient = apnsClient;
//        this.props = props;
//    }

    public CompletableFuture<PushNotificationResponse<SimpleApnsPushNotification>> sendSilent(
            String rawDeviceToken,
            Map<String, Object> customData
    ) {

        final String token = TokenUtil.sanitizeTokenString(rawDeviceToken);

        SimpleApnsPayloadBuilder payloadBuilder = new SimpleApnsPayloadBuilder();
        payloadBuilder.setContentAvailable(true);

        if (customData != null) {
            customData.forEach(payloadBuilder::addCustomProperty);
        }

        final String payload = payloadBuilder.build();

        final SimpleApnsPushNotification notification =
                new SimpleApnsPushNotification(
                        token,
                        props.getTopic(),
                        payload,
                        Instant.now().plusSeconds(60),
                        DeliveryPriority.CONSERVE_POWER,
                        PushType.BACKGROUND,
                        null,
                        null
                );

        return apnsClient.sendNotification(notification);
    }
}