package com.galaxyatlas.backend.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/satellites")
@CrossOrigin
public class SatelliteController {

    @GetMapping
    public ResponseEntity<?> getSatellites() {
        List<Map<String, Object>> satellites = new ArrayList<>();

        try {
            RestTemplate restTemplate = new RestTemplate();

            List<String> urls = List.of(
                    "https://celestrak.org/NORAD/elements/gp.php?CATNR=20580&FORMAT=JSON", // Hubble
                    "https://celestrak.org/NORAD/elements/gp.php?CATNR=28654&FORMAT=JSON", // NOAA 18
                    "https://celestrak.org/NORAD/elements/gp.php?CATNR=39084&FORMAT=JSON" // LANDSAT 8
            );

            for (String url : urls) {
                try {
                    List<?> response = restTemplate.getForObject(url, List.class);

                    if (response != null && !response.isEmpty()) {
                        Map<String, Object> item = (Map<String, Object>) response.get(0);

                        Map<String, Object> satellite = new HashMap<>();
                        satellite.put("id", item.get("NORAD_CAT_ID"));
                        satellite.put("name", item.getOrDefault("OBJECT_NAME", "Bilinmeyen Uydu"));
                        satellite.put("type", "UYDU");
                        satellite.put("description", "CelesTrak API verisi ile alınan gerçek uydu kaydı.");
                        satellite.put("status", "Aktif");
                        satellite.put("orbit", "EARTH");
                        satellite.put("risk", "Düşük");

                        // Geçici koordinatlar
                        satellite.put("latitude", new Random().nextDouble() * 180 - 90);
                        satellite.put("longitude", new Random().nextDouble() * 360 - 180);

                        satellites.add(satellite);
                    }
                } catch (Exception e) {
                    System.out.println("Uydu alınamadı: " + url + " -> " + e.getMessage());
                }
            }

            // Dış API tamamen sorun çıkarırsa bile boş dönmek yerine örnek veri ver
            if (satellites.isEmpty()) {
                satellites.add(createFallbackSatellite(20580L, "Hubble"));
                satellites.add(createFallbackSatellite(28654L, "NOAA 18"));
                satellites.add(createFallbackSatellite(39084L, "LANDSAT 8"));
            }

            return ResponseEntity.ok(satellites);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Uydu verisi çekilemedi: " + e.getMessage());
        }
    }

    private Map<String, Object> createFallbackSatellite(Long id, String name) {
        Map<String, Object> satellite = new HashMap<>();
        satellite.put("id", id);
        satellite.put("name", name);
        satellite.put("type", "UYDU");
        satellite.put("description", "Yedek uydu verisi");
        satellite.put("status", "Aktif");
        satellite.put("orbit", "EARTH");
        satellite.put("risk", "Düşük");
        satellite.put("latitude", new Random().nextDouble() * 180 - 90);
        satellite.put("longitude", new Random().nextDouble() * 360 - 180);
        return satellite;
    }
}