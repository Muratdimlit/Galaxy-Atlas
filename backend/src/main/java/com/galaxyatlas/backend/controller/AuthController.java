package com.galaxyatlas.backend.controller;

import com.galaxyatlas.backend.entity.User;
import com.galaxyatlas.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (user.getName() == null || user.getEmail() == null || user.getPassword() == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Ad, email ve şifre zorunludur.");
            return ResponseEntity.badRequest().body(response);
        }

        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Bu email ile kayıtlı kullanıcı zaten var.");
            return ResponseEntity.status(409).body(response);
        }

        User savedUser = userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Kullanıcı başarıyla kaydedildi.");
        response.put("user", savedUser);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Kullanıcı bulunamadı.");
            return ResponseEntity.status(404).body(response);
        }

        User dbUser = existingUser.get();

        if (!dbUser.getPassword().equals(user.getPassword())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Şifre yanlış.");
            return ResponseEntity.status(401).body(response);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Giriş başarılı.");
        response.put("user", dbUser);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {

        Optional<User> existingUser = userRepository.findById(id);

        if (existingUser.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Kullanıcı bulunamadı.");
            return ResponseEntity.status(404).body(response);
        }

        User user = existingUser.get();

        if (updatedUser.getName() != null) {
            user.setName(updatedUser.getName());
        }
        if (updatedUser.getEmail() != null) {
            user.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getPassword() != null) {
            user.setPassword(updatedUser.getPassword());
        }

        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Kullanıcı güncellendi.");
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {

        Optional<User> existingUser = userRepository.findById(id);

        if (existingUser.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Kullanıcı bulunamadı.");
            return ResponseEntity.status(404).body(response);
        }

        userRepository.deleteById(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Kullanıcı başarıyla silindi.");

        return ResponseEntity.ok(response);
    }
}