package com.galaxyatlas.backend.repository;

import com.galaxyatlas.backend.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUserId(Long userId);

    List<Favorite> findAllByUserIdAndSpaceObjectId(Long userId, Long spaceObjectId);
}