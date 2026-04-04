package com.galaxyatlas.backend.controller;

import com.galaxyatlas.backend.entity.SpaceObject;
import com.galaxyatlas.backend.repository.SpaceObjectRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Arrays;

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
    
    // ID'ye göre tek nesne getir
@GetMapping("/{id}")
public SpaceObject getById(@PathVariable Long id) {
    return repository.findById(id).orElseThrow();
}

// Karşılaştırma
// Örnek: /space-objects/compare?ids=1,2
@GetMapping("/compare")
public List<SpaceObject> compare(@RequestParam String ids) {
    List<Long> idList = Arrays.stream(ids.split(","))
            .map(String::trim)
            .map(Long::parseLong)
            .toList();

    return repository.findAllById(idList);
}

// Genel filtreleme
// Örnek: /space-objects/filter?type=ASTEROID
@GetMapping("/filter")
public List<SpaceObject> filterByType(@RequestParam String type) {
    return repository.findAll()
            .stream()
            .filter(obj -> obj.getType().equalsIgnoreCase(type))
            .toList();
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