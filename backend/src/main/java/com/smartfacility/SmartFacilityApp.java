package com.smartfacility;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.smartfacility.repository")
public class SmartFacilityApp {

    public static void main(String[] args) {
        SpringApplication.run(SmartFacilityApp.class, args);
    }
}
