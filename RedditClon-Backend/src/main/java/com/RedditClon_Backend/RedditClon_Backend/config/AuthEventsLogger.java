package com.RedditClon_Backend.RedditClon_Backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

@Component
public class AuthEventsLogger {

    private static final Logger log = LoggerFactory.getLogger(AuthEventsLogger.class);

    @EventListener
    public void onAuthSuccess(AuthenticationSuccessEvent event) {
        Authentication auth = event.getAuthentication();
        String username = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_ADMIN"));
        String type = isAdmin ? "ADMIN" : "USER";
        log.info("Usuario '{}' ha iniciado sesión como {}", username, type);
        System.out.println("[LOGIN] Usuario '" + username + "' ha iniciado sesión como " + type);
    }
}
