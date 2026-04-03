package com.galaxyatlas.backend.repository;

import com.galaxyatlas.backend.entity.SpaceObject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpaceObjectRepository extends JpaRepository<SpaceObject, Long> {
}