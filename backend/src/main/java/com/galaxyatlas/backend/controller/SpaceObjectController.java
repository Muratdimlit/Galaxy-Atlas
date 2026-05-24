
package com.galaxyatlas.backend.controller;

import com.galaxyatlas.backend.entity.SpaceObject;
import com.galaxyatlas.backend.repository.SpaceObjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/space-objects")
@CrossOrigin(origins = "*")
public class SpaceObjectController {

    private final SpaceObjectRepository repository;

    public SpaceObjectController(SpaceObjectRepository repository) {
        this.repository = repository;
    }

    // R5 - Tüm uzay nesnelerini listeleme
    @GetMapping
    public List<SpaceObject> getAll() {
        return repository.findAll();
    }

    // R8 - ASTEROID filtreleme
    @GetMapping("/asteroids")
    public List<SpaceObject> getAsteroids() {
        return repository.findAll()
                .stream()
                .filter(obj -> obj.getType() != null && obj.getType().equalsIgnoreCase("ASTEROID"))
                .toList();
    }

    // R8 - SATELLITE filtreleme
    @GetMapping("/satellites")
    public List<SpaceObject> getSatellites() {
        return repository.findAll()
                .stream()
                .filter(obj -> obj.getType() != null && obj.getType().equalsIgnoreCase("SATELLITE"))
                .toList();
    }

    // R8 - ROCKET filtreleme
    @GetMapping("/rockets")
    public List<SpaceObject> getRockets() {
        return repository.findAll()
                .stream()
                .filter(obj -> obj.getType() != null && obj.getType().equalsIgnoreCase("ROCKET"))
                .toList();
    }

    // R7 - İki uzay nesnesini karşılaştırma
    // Örnek: GET /space-objects/compare?id1=1&id2=2
    @GetMapping("/compare")
    public ResponseEntity<?> compareObjects(@RequestParam Long id1, @RequestParam Long id2) {
        SpaceObject firstObject = repository.findById(id1).orElse(null);
        SpaceObject secondObject = repository.findById(id2).orElse(null);

        if (firstObject == null || secondObject == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Karşılaştırılacak nesnelerden biri bulunamadı.");
            return ResponseEntity.status(404).body(response);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Uzay nesneleri başarıyla karşılaştırıldı.");
        response.put("firstObject", firstObject);
        response.put("secondObject", secondObject);

        return ResponseEntity.ok(response);
    }

    // R6 - Seçilen uzay nesnesinin detayını görüntüleme
    // Örnek: GET /space-objects/1
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        SpaceObject spaceObject = repository.findById(id).orElse(null);

        if (spaceObject == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Uzay nesnesi bulunamadı.");
            return ResponseEntity.status(404).body(response);
        }

        return ResponseEntity.ok(spaceObject);
    }

    // Test için yeni uzay nesnesi ekleme
    @PostMapping
    public SpaceObject add(@RequestBody SpaceObject obj) {
        return repository.save(obj);
    }
}
