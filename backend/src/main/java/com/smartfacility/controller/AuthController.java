package com.smartfacility.controller;

import com.smartfacility.model.User;
import com.smartfacility.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Value("${spring.security.oauth2.client.registration.google.client-id:}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret:}")
    private String googleClientSecret;

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

    // GET /api/auth/me
    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        try {
            User user = authService.getCurrentUserProfile(authentication.getName());

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("fullName", user.getFullName());
            response.put("phoneNumber", user.getPhoneNumber());
            response.put("email", user.getEmail());
            response.put("role", user.getRole().name());
            response.put("active", user.getActive());
            response.put("mustResetPassword", user.getMustResetPassword());
            response.put("lastPasswordChangedAt", user.getLastPasswordChangedAt());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // POST /api/auth/forgot-password/request
    @PostMapping("/forgot-password/request")
    public ResponseEntity<?> requestPasswordResetCode(@RequestBody Map<String, String> request) {
        try {
            AuthService.ForgotPasswordCodeResult result = authService.requestPasswordResetCode(request.get("email"));

            Map<String, Object> response = new HashMap<>();
            response.put("message", result.message());
            response.put("expiresInMinutes", result.expiresInMinutes());
            if (result.code() != null) {
                response.put("code", result.code());
            }
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // POST /api/auth/forgot-password/reset
    @PostMapping("/forgot-password/reset")
    public ResponseEntity<?> resetPasswordWithCode(@RequestBody Map<String, String> request) {
        try {
            User updated = authService.resetPasswordWithCode(
                    request.get("email"),
                    request.get("code"),
                    request.get("newPassword")
            );

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Password reset successful");
            response.put("email", updated.getEmail());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // PUT /api/auth/me/full-name
    @PutMapping("/me/full-name")
    public ResponseEntity<?> updateMyFullName(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            User updated = authService.updateOwnProfile(
                    authentication.getName(),
                    request.get("fullName"),
                    request.get("phoneNumber")
            );

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Full name updated successfully");
            response.put("fullName", updated.getFullName());
            response.put("phoneNumber", updated.getPhoneNumber());
            response.put("email", updated.getEmail());
            response.put("role", updated.getRole().name());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // PUT /api/auth/me/profile
    @PutMapping("/me/profile")
    public ResponseEntity<?> updateMyProfile(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            User updated = authService.updateOwnProfile(
                    authentication.getName(),
                    request.get("fullName"),
                    request.get("phoneNumber")
            );

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            response.put("fullName", updated.getFullName());
            response.put("phoneNumber", updated.getPhoneNumber());
            response.put("email", updated.getEmail());
            response.put("role", updated.getRole().name());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // PUT /api/auth/me/password/first-login
    @PutMapping("/me/password/first-login")
    public ResponseEntity<?> resetFirstLoginPassword(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            User updated = authService.resetFirstLoginPassword(authentication.getName(), request.get("newPassword"));

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Password reset successful");
            response.put("email", updated.getEmail());
            response.put("mustResetPassword", updated.getMustResetPassword());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

        // GET /api/auth/oauth/google/enabled
        @GetMapping("/oauth/google/enabled")
        public ResponseEntity<?> isGoogleOauthEnabled() {
        Map<String, Object> response = new HashMap<>();

        boolean hasClientId = googleClientId != null
            && !googleClientId.isBlank()
            && !"local-dev-client-id".equals(googleClientId);

        boolean hasClientSecret = googleClientSecret != null
            && !googleClientSecret.isBlank()
            && !"local-dev-client-secret".equals(googleClientSecret);

        boolean enabled = hasClientId && hasClientSecret;

        response.put("enabled", enabled);
        response.put("message", enabled
            ? "Google OAuth is configured"
            : "Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.");

        return ResponseEntity.ok(response);
        }

}
