package com.galaxyatlas.backend;

import com.galaxyatlas.backend.entity.SpaceObject;
import com.galaxyatlas.backend.repository.SpaceObjectRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadData(SpaceObjectRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                SpaceObject hubble = new SpaceObject();
                hubble.setName("Hubble");
                hubble.setType("UYDU");
                hubble.setDescription("Dünya yörüngesinde gözlem yapan gelişmiş uzay teleskobu.");
                hubble.setLatitude(28.5);
                hubble.setLongitude(-80.6);

                SpaceObject falcon9 = new SpaceObject();
                falcon9.setName("Falcon 9");
                falcon9.setType("ROKET");
                falcon9.setDescription("Yeniden kullanılabilir modern fırlatma roketi.");
                falcon9.setLatitude(34.7);
                falcon9.setLongitude(-120.6);

                SpaceObject apophis = new SpaceObject();
                apophis.setName("Apophis");
                apophis.setType("ASTEROID");
                apophis.setDescription("Dünya'ya yakın geçişleriyle dikkat çeken gök cismi.");
                apophis.setLatitude(10.0);
                apophis.setLongitude(20.0);

                repository.save(hubble);
                repository.save(falcon9);
                repository.save(apophis);

                System.out.println("Başlangıç uzay nesneleri Neon veritabanına eklendi.");
            }
        };
    }
}