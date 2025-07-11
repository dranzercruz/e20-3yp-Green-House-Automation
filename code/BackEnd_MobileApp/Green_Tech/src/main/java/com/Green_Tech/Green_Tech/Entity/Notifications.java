package com.Green_Tech.Green_Tech.Entity;

public class Notifications {

    private String title;
    private String message;
    private String topic; //or token

    public Notifications() {
        super();
    }

    public Notifications(String title, String message, String topic) {
        super();
        this.title = title;
        this.message = message;
        this.topic = topic;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }





}
