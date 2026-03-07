package com.smartfacility.controller;

import com.smartfacility.model.User;
import com.smartfacility.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            User user = authService.register(
                    request.get("fullName"),
                    request.get("email"),
                    request.get("password"),
                    request.get("role")
            );

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("userId", user.getId());
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String token = authService.login(
                    request.get("email"),
                    request.get("password")
            );

            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("message", "Login successful");
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(401).body(error);
        }
    }
}
