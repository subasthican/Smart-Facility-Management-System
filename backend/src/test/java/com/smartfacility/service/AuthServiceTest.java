package com.smartfacility.service;

import com.smartfacility.config.JwtUtil;
import com.smartfacility.model.User;
import com.smartfacility.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setFullName("Test User");
        user.setEmail("test@example.com");
        user.setPassword("encoded-password");
        user.setRole(User.Role.STUDENT);
    }

    @Test
    void registerShouldSaveUserWhenEmailIsNew() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User saved = authService.register("Test User", "test@example.com", "password123", "student");

        assertEquals("test@example.com", saved.getEmail());
        assertEquals(User.Role.STUDENT, saved.getRole());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerShouldThrowWhenEmailExists() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                authService.register("Test User", "test@example.com", "password123", "student"));

        assertEquals("Email already exists", ex.getMessage());
    }

    @Test
    void loginShouldReturnTokenWhenCredentialsAreValid() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "encoded-password")).thenReturn(true);
        when(jwtUtil.generateToken("test@example.com", "STUDENT")).thenReturn("jwt-token");

        String token = authService.login("test@example.com", "password123");

        assertEquals("jwt-token", token);
    }

    @Test
    void loginShouldThrowWhenPasswordIsInvalid() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "encoded-password")).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                authService.login("test@example.com", "wrong"));

        assertEquals("Invalid email or password", ex.getMessage());
    }
}
