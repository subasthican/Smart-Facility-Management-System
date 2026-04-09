package com.smartfacility.service;

import com.smartfacility.config.JwtUtil;
import com.smartfacility.model.User;
import com.smartfacility.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.password-reset.from-email:}")
    private String passwordResetFromEmail;

    @Value("${app.password-reset.code-expiry-minutes:10}")
    private int passwordResetCodeExpiryMinutes;

    @Value("${app.password-reset.return-code-in-response:false}")
    private boolean returnCodeInResponse;

    private final Random random = new Random();

    // Public self-registration (student only)
    public User register(String fullName, String email, String password, String role) {
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFullName(fullName);
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(password));
        
        // Use provided role if valid, otherwise default to STUDENT
        User.Role userRole = User.Role.STUDENT;
        if (role != null && !role.isEmpty()) {
            try {
                userRole = User.Role.valueOf(role.toUpperCase());
            } catch (Exception ex) {
                // Invalid role provided, use default STUDENT
            }
        }
        user.setRole(userRole);
        user.setActive(true);
        user.setMustResetPassword(false);
        user.setTemporaryPassword(null);
        user.setLastPasswordChangedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    // Admin user creation (staff/student only)
    public AdminCreatedUserResult createUserByAdmin(String fullName, String email, String password, String role) {
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new RuntimeException("Email already exists");
        }

        String normalizedName = fullName == null ? "" : fullName.trim();
        if (normalizedName.isEmpty()) {
            throw new RuntimeException("Full name is required");
        }
        if (normalizedEmail.isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        User.Role targetRole;
        try {
            if (role == null) {
                throw new RuntimeException("Invalid role");
            }
            targetRole = User.Role.valueOf(role.toUpperCase());
        } catch (Exception ex) {
            throw new RuntimeException("Invalid role");
        }

        if (targetRole == User.Role.ADMIN) {
            throw new RuntimeException("Admin account creation is not allowed from this endpoint");
        }

        String tempPassword = (password == null || password.isBlank()) ? generateTemporaryPassword() : password;

        User user = new User();
        user.setFullName(normalizedName);
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setRole(targetRole);
        user.setActive(true);
        user.setMustResetPassword(true);
        user.setTemporaryPassword(tempPassword);
        user.setLastPasswordChangedAt(null);

        User saved = userRepository.save(user);
        return new AdminCreatedUserResult(saved, tempPassword);
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
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(normalizedEmail);

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

    // First-login password reset (for admin-created accounts)
    public User resetFirstLoginPassword(String email, String newPassword) {
        User user = getCurrentUserProfile(email);

        String normalized = newPassword == null ? "" : newPassword.trim();
        if (normalized.length() < 8) {
            throw new RuntimeException("New password must be at least 8 characters");
        }

        user.setPassword(passwordEncoder.encode(normalized));
        user.setMustResetPassword(false);
        user.setTemporaryPassword(null);
        user.setLastPasswordChangedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    // Forgot-password flow: generate email code and store expiry
    public ForgotPasswordCodeResult requestPasswordResetCode(String email) {
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
        if (normalizedEmail.isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("No account found for this email"));

        String code = String.format("%06d", random.nextInt(1_000_000));
        user.setPasswordResetCode(code);
        user.setPasswordResetCodeExpiresAt(LocalDateTime.now().plusMinutes(passwordResetCodeExpiryMinutes));
        userRepository.save(user);

        sendResetCodeEmail(normalizedEmail, code);

        return new ForgotPasswordCodeResult(
                "Password reset code sent to email",
                returnCodeInResponse ? code : null,
                passwordResetCodeExpiryMinutes
        );
    }

    // Forgot-password flow: confirm code and set new password
    public User resetPasswordWithCode(String email, String code, String newPassword) {
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("No account found for this email"));

        String normalizedCode = code == null ? "" : code.trim();
        if (normalizedCode.isEmpty()) {
            throw new RuntimeException("Reset code is required");
        }

        if (user.getPasswordResetCode() == null
                || user.getPasswordResetCodeExpiresAt() == null
                || LocalDateTime.now().isAfter(user.getPasswordResetCodeExpiresAt())
                || !normalizedCode.equals(user.getPasswordResetCode())) {
            throw new RuntimeException("Invalid or expired reset code");
        }

        String normalizedPassword = newPassword == null ? "" : newPassword.trim();
        if (normalizedPassword.length() < 8) {
            throw new RuntimeException("New password must be at least 8 characters");
        }

        user.setPassword(passwordEncoder.encode(normalizedPassword));
        user.setMustResetPassword(false);
        user.setTemporaryPassword(null);
        user.setPasswordResetCode(null);
        user.setPasswordResetCodeExpiresAt(null);
        user.setLastPasswordChangedAt(LocalDateTime.now());

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
        user.setMustResetPassword(false);
        user.setTemporaryPassword(null);
        user.setLastPasswordChangedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    private void sendResetCodeEmail(String toEmail, String code) {
        if (passwordResetFromEmail == null || passwordResetFromEmail.isBlank()) {
            throw new RuntimeException("SMTP sender email is not configured. Set app.password-reset.from-email or MAIL_USERNAME.");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(passwordResetFromEmail);
        message.setTo(toEmail);
        message.setSubject("Smart Facility - Password Reset Code");
        message.setText(
                "Your password reset code is: " + code + "\n\n"
                        + "This code expires in " + passwordResetCodeExpiryMinutes + " minutes."
        );

        try {
            mailSender.send(message);
        } catch (Exception ex) {
            // Keep flow working in development even if SMTP is not configured.
            if (!returnCodeInResponse) {
                String detail = ex.getMessage();
                if (detail != null && detail.length() > 180) {
                    detail = detail.substring(0, 180) + "...";
                }
                throw new RuntimeException(
                        "Failed to send reset code email. Check SMTP host/username/password and SMTP AUTH."
                                + (detail == null || detail.isBlank() ? "" : " Details: " + detail)
                );
            }
        }
    }

    private String generateTemporaryPassword() {
        String seed = UUID.randomUUID().toString().replace("-", "");
        return "Temp@" + seed.substring(0, 8);
    }

    public record AdminCreatedUserResult(User user, String temporaryPassword) {
    }

    public record ForgotPasswordCodeResult(String message, String code, int expiresInMinutes) {
    }
}
