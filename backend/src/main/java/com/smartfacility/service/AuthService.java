package com.smartfacility.service;

import com.smartfacility.config.JwtUtil;
import com.smartfacility.model.User;
import com.smartfacility.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    // Register a new user
    public User register(String fullName, String email, String password, String role) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(User.Role.valueOf(role.toUpperCase()));

        return userRepository.save(user);
    }

    // Login and return JWT token
    public String login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return jwtUtil.generateToken(user.getEmail(), user.getRole().name());
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
