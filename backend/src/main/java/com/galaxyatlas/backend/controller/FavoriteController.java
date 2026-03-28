package com.galaxyatlas.backend.controller;

import com.galaxyatlas.backend.entity.Favorite;
import com.galaxyatlas.backend.repository.FavoriteRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
@CrossOrigin
public class FavoriteController {

    private final FavoriteRepository repository;

    public FavoriteController(FavoriteRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Favorite add(@RequestBody Favorite favorite) {
        List<Favorite> existing = repository.findAllByUserIdAndSpaceObjectId(
                favorite.getUserId(),
                favorite.getSpaceObjectId());

        if (!existing.isEmpty()) {
            return existing.get(0);
        }

        return repository.save(favorite);
    }

    @GetMapping("/{userId}")
    public List<Favorite> getByUser(@PathVariable Long userId) {
        return repository.findByUserId(userId);
    }

    @DeleteMapping
    public void remove(@RequestParam Long userId, @RequestParam Long spaceObjectId) {
        List<Favorite> favorites = repository.findAllByUserIdAndSpaceObjectId(userId, spaceObjectId);
        repository.deleteAll(favorites);
    }
}