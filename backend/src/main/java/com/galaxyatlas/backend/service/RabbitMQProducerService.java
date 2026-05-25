package com.galaxyatlas.backend.service;

import com.galaxyatlas.backend.config.RabbitMQConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class RabbitMQProducerService {

    private final RabbitTemplate rabbitTemplate;

    public RabbitMQProducerService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendFavoriteMessage(Long userId, Long spaceObjectId) {
        String message = "User " + userId + " favorited SpaceObject " + spaceObjectId;

        rabbitTemplate.convertAndSend(RabbitMQConfig.FAVORITE_QUEUE, message);

        System.out.println("RabbitMQ mesaji gonderildi: " + message);
    }
}