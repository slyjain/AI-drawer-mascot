package com.trello.primary.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Configure CORS to allow requests from your React frontend
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 2. Disable CSRF for now (common in stateless REST APIs, though we're using sessions here initially)
            .csrf(csrf -> csrf.disable())
            
            // 3. Define which endpoints are public vs protected
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/api/public/**").permitAll() // Allow public access to root and /api/public
                .anyRequest().authenticated() // All other requests require authentication
            )
            
            // 4. Enable OAuth2 Login (Google)
            .oauth2Login(oauth2 -> oauth2
                // When login is successful, redirect to the frontend
                .defaultSuccessUrl("http://localhost:5173", true)
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow the React dev server origin
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true); // Required if we are using sessions/cookies

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
