package com.smartfacility.controller;

import com.smartfacility.model.User;
import com.smartfacility.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private AuthService authService;

    // POST /api/admin/users - Admin creates staff/student accounts
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> request) {
        try {
            AuthService.AdminCreatedUserResult created = authService.createUserByAdmin(
                    request.get("fullName"),
                    request.get("email"),
                    request.get("password"),
                    request.get("role")
            );
            User user = created.user();

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User created successfully");
            response.put("userId", user.getId());
            response.put("role", user.getRole().name());
            response.put("temporaryPassword", created.temporaryPassword());
            response.put("mustResetPassword", user.getMustResetPassword());
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // GET /api/admin/users - Admin views staff/student accounts
    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        try {
            List<User> users = authService.getManageableUsers();
            List<Map<String, Object>> response = new ArrayList<>();

            for (User user : users) {
                Map<String, Object> item = new HashMap<>();
                item.put("id", user.getId());
                item.put("fullName", user.getFullName());
                item.put("email", user.getEmail());
                item.put("role", user.getRole().name());
                item.put("active", user.getActive());
                item.put("mustResetPassword", user.getMustResetPassword());
                item.put("temporaryPassword", Boolean.TRUE.equals(user.getMustResetPassword()) ? user.getTemporaryPassword() : null);
                item.put("lastPasswordChangedAt", user.getLastPasswordChangedAt());
                response.add(item);
            }

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // POST /api/admin/users/list - fallback list endpoint when GET is restricted upstream
    @PostMapping("/users/list")
    public ResponseEntity<?> listUsers() {
        return getUsers();
    }

    // PUT /api/admin/users/{id}/status - Admin sets active/inactive
    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> request) {
        try {
            Boolean active = request.get("active");
            if (active == null) {
                throw new RuntimeException("active field is required");
            }

            User updated = authService.updateUserActiveStatus(id, active);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User status updated successfully");
            response.put("userId", updated.getId());
            response.put("active", updated.getActive());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // PUT /api/admin/users/{id} - Admin updates basic user details
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            User updated = authService.updateUserDetailsByAdmin(
                    id,
                    request.get("fullName"),
                    request.get("email")
            );

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User updated successfully");
            response.put("userId", updated.getId());
            response.put("fullName", updated.getFullName());
            response.put("email", updated.getEmail());
            response.put("role", updated.getRole().name());
            response.put("active", updated.getActive());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
