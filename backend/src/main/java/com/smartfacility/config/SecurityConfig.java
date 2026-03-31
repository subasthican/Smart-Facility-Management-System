package com.smartfacility.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/auth/register", "/auth/login").permitAll()
                    .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                    .requestMatchers(HttpMethod.GET, "/facilities/**", "/assets/**")
                    .hasAnyRole("STUDENT", "STAFF", "ADMIN")
                    .requestMatchers(HttpMethod.POST, "/facilities/**", "/assets/**")
                    .hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/facilities/**", "/assets/**")
                    .hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/facilities/**", "/assets/**")
                    .hasRole("ADMIN")

                    .requestMatchers(HttpMethod.POST, "/bookings").hasRole("STUDENT")
                    .requestMatchers(HttpMethod.GET, "/bookings").hasAnyRole("STAFF", "ADMIN")
                    .requestMatchers(HttpMethod.GET, "/bookings/my").hasAnyRole("STUDENT", "STAFF", "ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/bookings/*/confirm").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/bookings/*/cancel").hasAnyRole("STUDENT", "ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/bookings/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2.successHandler(oAuth2LoginSuccessHandler))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
