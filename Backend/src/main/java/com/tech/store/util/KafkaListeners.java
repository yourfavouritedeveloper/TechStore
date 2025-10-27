package com.tech.store.util;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaListeners {

    @KafkaListener(topics = "account",groupId = "groupId")
    void listener(String data) {

        System.out.println("Listening on topic: " + data);

    }
}
