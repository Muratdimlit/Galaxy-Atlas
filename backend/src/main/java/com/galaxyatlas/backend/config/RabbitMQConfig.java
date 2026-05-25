package com.galaxyatlas.backend.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String FAVORITE_QUEUE = "favorite.queue";

    @Bean
    public Queue favoriteQueue() {
        return new Queue(FAVORITE_QUEUE, true);
    }
}