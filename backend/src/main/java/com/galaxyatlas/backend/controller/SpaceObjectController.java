package com.galaxyatlas.backend.controller;

import com.galaxyatlas.backend.entity.SpaceObject;
import com.galaxyatlas.backend.repository.SpaceObjectRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/space-objects")
@CrossOrigin
public class SpaceObjectController {

    private final SpaceObjectRepository repository;

    public SpaceObjectController(SpaceObjectRepository repository) {
        this.repository = repository;
    }

    // Tüm nesneleri getir
    @GetMapping
    public List<SpaceObject> getAll() {
        return repository.findAll();
    }

    // ASTEROID filtre
    @GetMapping("/asteroids")
    public List<SpaceObject> getAsteroids() {
        return repository.findAll()
                .stream()
                .filter(obj -> obj.getType().equalsIgnoreCase("ASTEROID"))
                .toList();
    }

    // SATELLITE filtre
    @GetMapping("/satellites")
    public List<SpaceObject> getSatellites() {
        return repository.findAll()
                .stream()
                .filter(obj -> obj.getType().equalsIgnoreCase("SATELLITE"))
                .toList();
    }

    // ROCKET filtre
    @GetMapping("/rockets")
    public List<SpaceObject> getRockets() {
        return repository.findAll()
                .stream()
                .filter(obj -> obj.getType().equalsIgnoreCase("ROCKET"))
                .toList();
    }

    // Yeni nesne ekleme (test için)
    @PostMapping
    public SpaceObject add(@RequestBody SpaceObject obj) {
        return repository.save(obj);
    }
}