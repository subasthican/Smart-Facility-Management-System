package com.smartfacility.config;

import com.smartfacility.model.User;
import com.smartfacility.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminSeeder {

    @Bean
    public CommandLineRunner seedDefaultAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@gmail.com";
            if (!userRepository.existsByEmail(adminEmail)) {
                User admin = new User();
                admin.setFullName("System Admin");
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(User.Role.ADMIN);
                userRepository.save(admin);
            }
        };
    }
}
