package com.smartfacility.config;

import com.smartfacility.model.User;
import com.smartfacility.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Value("${frontend.app-url:http://localhost:3000}")
    private String frontendAppUrl;

    public OAuth2LoginSuccessHandler(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        if (email == null || email.isBlank()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "OAuth provider did not return email");
            return;
        }

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User created = new User();
            created.setFullName((name == null || name.isBlank()) ? "OAuth User" : name);
            created.setEmail(email);
            created.setRole(User.Role.STUDENT);
            // OAuth users don't use password login, but DB column is non-null.
            created.setPassword("OAUTH2_USER");
            return userRepository.save(created);
        });
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        String redirectUrl = UriComponentsBuilder
                .fromUriString(frontendAppUrl)
                .path("/oauth2/callback")
                .queryParam("token", token)
                .build()
                .toUriString();

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
