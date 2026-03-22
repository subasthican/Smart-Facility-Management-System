package com.smartfacility.service;

import com.smartfacility.config.JwtUtil;
import com.smartfacility.model.User;
import com.smartfacility.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
}
