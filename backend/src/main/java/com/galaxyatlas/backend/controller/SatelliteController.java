package com.galaxyatlas.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/satellites")
@CrossOrigin
public class SatelliteController {

    @GetMapping
    public ResponseEntity<?> getSatellites() {
        try {
            RestTemplate restTemplate = new RestTemplate();

            List<String> urls = List.of(
                    "https://celestrak.org/NORAD/elements/gp.php?CATNR=20580&FORMAT=JSON", // Hubble
                    "https://celestrak.org/NORAD/elements/gp.php?CATNR=28654&FORMAT=JSON", // NOAA 18
                    "https://celestrak.org/NORAD/elements/gp.php?CATNR=39084&FORMAT=JSON" // LANDSAT 8
            );

            List<Map<String, Object>> satellites = new ArrayList<>();

            for (String url : urls) {
                List response = restTemplate.getForObject(url, List.class);

                if (response != null && !response.isEmpty()) {
                    Map item = (Map) response.get(0);

                    Map<String, Object> satellite = new HashMap<>();
                    satellite.put("id", item.get("NORAD_CAT_ID"));
                    satellite.put("name", item.getOrDefault("OBJECT_NAME", "Bilinmeyen Uydu"));
                    satellite.put("type", "UYDU");
                    satellite.put("description", "CelesTrak API verisi ile alınan gerçek uydu kaydı.");
                    satellite.put("status", "Aktif");
                    satellite.put("orbit", item.getOrDefault("CENTER_NAME", "EARTH"));
                    satellite.put("risk", "Düşük");

                    satellites.add(satellite);
                }
            }

            return ResponseEntity.ok(satellites);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Uydu API hatası");
            error.put("details", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}