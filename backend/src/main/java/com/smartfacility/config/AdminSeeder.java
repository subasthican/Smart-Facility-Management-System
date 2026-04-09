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
            String legacyAdminEmail = "admin@gmail.com";
            String newAdminEmail = "admin@test.com";

            User existingNewAdmin = userRepository.findByEmail(newAdminEmail).orElse(null);
            if (existingNewAdmin != null) {
                existingNewAdmin.setFullName("System Admin");
                existingNewAdmin.setPassword(passwordEncoder.encode("Admin@123"));
                existingNewAdmin.setRole(User.Role.ADMIN);
                existingNewAdmin.setActive(true);
                userRepository.save(existingNewAdmin);
                return;
            }

            // If a legacy seeded admin exists, migrate it to the new default credentials.
            User admin = userRepository.findByEmail(legacyAdminEmail).orElse(null);
            if (admin != null) {
                admin.setEmail(newAdminEmail);
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setRole(User.Role.ADMIN);
                admin.setActive(true);
                userRepository.save(admin);
                return;
            }

            // Ensure a default admin is always available with the new credentials.
            if (!userRepository.existsByEmail(newAdminEmail)) {
                User newAdmin = new User();
                newAdmin.setFullName("System Admin");
                newAdmin.setEmail(newAdminEmail);
                newAdmin.setPassword(passwordEncoder.encode("Admin@123"));
                newAdmin.setRole(User.Role.ADMIN);
                newAdmin.setActive(true);
                userRepository.save(newAdmin);
            }
        };
    }
}
