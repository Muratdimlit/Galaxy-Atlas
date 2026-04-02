package com.galaxyatlas.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/asteroids")
@CrossOrigin
public class AsteroidController {

    @Value("${nasa.api.key}")
    private String nasaApiKey;

    @GetMapping
    public ResponseEntity<?> getAsteroids(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            String url = "https://api.nasa.gov/neo/rest/v1/feed?start_date="
                    + startDate
                    + "&end_date="
                    + endDate
                    + "&api_key="
                    + nasaApiKey;

            RestTemplate restTemplate = new RestTemplate();
            Map response = restTemplate.getForObject(url, Map.class);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "NASA API hatası");
            error.put("details", e.getMessage());
            return ResponseEntity.status(429).body(error);
        }
    }
}