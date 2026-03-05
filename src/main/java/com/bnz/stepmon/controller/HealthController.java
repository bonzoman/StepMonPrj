package com.bnz.stepmon.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalTime;

@RestController
@RequiredArgsConstructor
public class HealthController {

    private final com.bnz.stepmon.biz.spec.MyTelegramBot myTelegramBot;

    @GetMapping("/health")
    public String health() {
        return "OK";
    }

    @GetMapping("/sendtel")
    public String sendtel() {
        myTelegramBot.send("test"+ LocalTime.now());
        return "OK";
    }
}
