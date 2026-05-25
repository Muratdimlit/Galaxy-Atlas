package com.galaxyatlas.backend.controller;

import com.galaxyatlas.backend.entity.Favorite;
import com.galaxyatlas.backend.repository.FavoriteRepository;
import com.galaxyatlas.backend.service.RabbitMQProducerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
@CrossOrigin
public class FavoriteController {

    private final FavoriteRepository repository;
    private final RabbitMQProducerService rabbitMQProducerService;

    public FavoriteController(
            FavoriteRepository repository,
            RabbitMQProducerService rabbitMQProducerService
    ) {
        this.repository = repository;
        this.rabbitMQProducerService = rabbitMQProducerService;
    }

    @PostMapping
    public Favorite add(@RequestBody Favorite favorite) {
        List<Favorite> existing = repository.findAllByUserIdAndSpaceObjectId(
                favorite.getUserId(),
                favorite.getSpaceObjectId()
        );

        if (!existing.isEmpty()) {
            return existing.get(0);
        }

        Favorite savedFavorite = repository.save(favorite);

        rabbitMQProducerService.sendFavoriteMessage(
                savedFavorite.getUserId(),
                savedFavorite.getSpaceObjectId()
        );

        return savedFavorite;
    }

    @GetMapping("/{userId}")
    public List<Favorite> getByUser(@PathVariable Long userId) {
        return repository.findByUserId(userId);
    }

    @DeleteMapping
    public void remove(@RequestParam Long userId, @RequestParam Long spaceObjectId) {
        List<Favorite> favorites = repository.findAllByUserIdAndSpaceObjectId(
                userId,
                spaceObjectId
        );

        repository.deleteAll(favorites);
    }
}