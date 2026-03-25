package com.galaxyatlas.backend.controller;

import com.galaxyatlas.backend.entity.Favorite;
import com.galaxyatlas.backend.repository.FavoriteRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
@CrossOrigin
public class FavoriteController {

    private final FavoriteRepository favoriteRepository;

    public FavoriteController(FavoriteRepository favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    // R9 - Favoriye ekleme
    @PostMapping
    public Favorite addFavorite(@RequestBody Favorite favorite) {
        return favoriteRepository.save(favorite);
    }

    // R11 - Favori listeleme
    @GetMapping
    public List<Favorite> getFavorites(@RequestParam Long userId) {
        return favoriteRepository.findByUserId(userId);
    }

    // R10 - Favoriden çıkarma
    @DeleteMapping("/{id}")
    public void deleteFavorite(@PathVariable Long id) {
        favoriteRepository.deleteById(id);
    }
}