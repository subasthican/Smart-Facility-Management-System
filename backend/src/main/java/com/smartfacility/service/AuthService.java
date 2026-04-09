package com.smartfacility.service;

import com.smartfacility.config.JwtUtil;
import com.smartfacility.model.User;
import com.smartfacility.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // Public self-registration (student only)
    public User register(String fullName, String email, String password, String role) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(User.Role.STUDENT);
        user.setActive(true);

        return userRepository.save(user);
    }

    // Admin user creation (staff/student only)
    public User createUserByAdmin(String fullName, String email, String password, String role) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        User.Role targetRole;
        try {
            targetRole = User.Role.valueOf(role.toUpperCase());
        } catch (Exception ex) {
            throw new RuntimeException("Invalid role");
        }

        if (targetRole == User.Role.ADMIN) {
            throw new RuntimeException("Admin account creation is not allowed from this endpoint");
        }

        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(targetRole);
        user.setActive(true);

        return userRepository.save(user);
    }

    // Admin fetches manageable users (staff/student)
    public List<User> getManageableUsers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() != User.Role.ADMIN)
                .toList();
    }

    // Admin toggles active/inactive status for staff/student
    public User updateUserActiveStatus(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == User.Role.ADMIN) {
            throw new RuntimeException("Cannot modify admin account status");
        }

        user.setActive(active);
        return userRepository.save(user);
    }

    // Admin updates basic details for staff/student accounts
    public User updateUserDetailsByAdmin(Long userId, String fullName, String email) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == User.Role.ADMIN) {
            throw new RuntimeException("Cannot modify admin account");
        }

        String normalizedName = fullName == null ? "" : fullName.trim();
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();

        if (normalizedName.isEmpty()) {
            throw new RuntimeException("Full name is required");
        }
        if (normalizedEmail.isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        if (!normalizedEmail.equals(user.getEmail()) && userRepository.existsByEmail(normalizedEmail)) {
            throw new RuntimeException("Email already exists");
        }

        user.setFullName(normalizedName);
        user.setEmail(normalizedEmail);
        return userRepository.save(user);
    }

    // Login and return JWT token
    public String login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = userOpt.get();

        if (Boolean.FALSE.equals(user.getActive())) {
            throw new RuntimeException("Account is inactive. Please contact admin.");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    }

    // Authenticated user profile lookup by email (subject from JWT)
    public User getCurrentUserProfile(String email) {
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
        return userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Self-service full-name update (student/staff only)
    public User updateOwnFullName(String email, String fullName) {
        User user = getCurrentUserProfile(email);

        if (user.getRole() == User.Role.ADMIN) {
            throw new RuntimeException("Admin full name update is not allowed from this endpoint");
        }

        String normalizedName = fullName == null ? "" : fullName.trim();
        if (normalizedName.isEmpty()) {
            throw new RuntimeException("Full name is required");
        }

        user.setFullName(normalizedName);
        return userRepository.save(user);
    }

    // Self-service profile update (student/staff only)
    public User updateOwnProfile(String email, String fullName, String phoneNumber) {
        User user = getCurrentUserProfile(email);

        if (user.getRole() == User.Role.ADMIN) {
            throw new RuntimeException("Admin profile update is not allowed from this endpoint");
        }

        String normalizedName = fullName == null ? "" : fullName.trim();
        if (normalizedName.isEmpty()) {
            throw new RuntimeException("Full name is required");
        }

        String normalizedPhone = phoneNumber == null ? "" : phoneNumber.trim();
        if (normalizedPhone.length() > 30) {
            throw new RuntimeException("Phone number is too long");
        }

        user.setFullName(normalizedName);
        user.setPhoneNumber(normalizedPhone.isEmpty() ? null : normalizedPhone);
        return userRepository.save(user);
    }

    // OAuth login/register: create user on first login and return existing user otherwise
    public User findOrCreateOAuthUser(String fullName, String email) {
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) {
            return existing.get();
        }

        User user = new User();
        user.setFullName((fullName == null || fullName.isBlank()) ? "OAuth User" : fullName);
        user.setEmail(email);
        user.setRole(User.Role.STUDENT);

        // Keep password non-null for schema compatibility.
        user.setPassword(passwordEncoder.encode("OAUTH2_" + UUID.randomUUID()));

        return userRepository.save(user);
    }
}
