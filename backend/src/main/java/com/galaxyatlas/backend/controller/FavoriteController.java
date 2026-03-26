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

    // Favori ekle
    @PostMapping
    public Favorite addFavorite(@RequestBody Favorite favorite) {
        return favoriteRepository.save(favorite);
    }

    // Kullanıcının favorilerini getir
    @GetMapping("/{userId}")
    public List<Favorite> getFavorites(@PathVariable Long userId) {
        return favoriteRepository.findByUserId(userId);
    }

    // Favoriden çıkar
    @DeleteMapping
    public void removeFavorite(@RequestParam Long userId,
            @RequestParam Long spaceObjectId) {
        favoriteRepository.deleteByUserIdAndSpaceObjectId(userId, spaceObjectId);
    }
}