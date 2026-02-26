package com.bnz.stepmon.config;

public class ApnsProperties {
    private String teamId;
    private String keyId;
    private String p8Path;
    private String topic;
    private boolean useSandbox = true;

    public String getTeamId() {
        return teamId;
    }

    public void setTeamId(String teamId) {
        this.teamId = teamId;
    }

    public String getKeyId() {
        return keyId;
    }

    public void setKeyId(String keyId) {
        this.keyId = keyId;
    }

    public String getP8Path() {
        return p8Path;
    }

    public void setP8Path(String p8Path) {
        this.p8Path = p8Path;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public boolean isUseSandbox() {
        return useSandbox;
    }

    public void setUseSandbox(boolean useSandbox) {
        this.useSandbox = useSandbox;
    }
}
