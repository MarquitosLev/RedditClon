package com.RedditClon_Backend.RedditClon_Backend.service;

import com.RedditClon_Backend.RedditClon_Backend.model.PasswordResetToken;
import com.RedditClon_Backend.RedditClon_Backend.model.User;
import com.RedditClon_Backend.RedditClon_Backend.repository.PasswordResetTokenRepository;
import com.RedditClon_Backend.RedditClon_Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.password-reset.token-expiry-minutes:30}")
    private int tokenExpiryMinutes;

    @Transactional
    public void requestPasswordReset(String email) {
        Optional<User> userOpt = userRepository.findByUsername(email);

        // Si no existe por username, buscar por email
        if (userOpt.isEmpty()) {
            userOpt = findUserByEmail(email);
        }

        if (userOpt.isEmpty()) {
            // Por seguridad, no revelamos si el usuario existe o no
            System.out.println("[PASSWORD_RESET] Email no encontrado: " + email);
            return;
        }

        User user = userOpt.get();

        // Eliminar tokens anteriores del usuario
        tokenRepository.deleteByUser(user);

        // Crear nuevo token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(tokenExpiryMinutes))
                .used(false)
                .build();

        tokenRepository.save(resetToken);

        // Enviar email
        String userEmail = user.getEmail() != null ? user.getEmail() : email;
        emailService.sendPasswordResetEmail(userEmail, token);

        System.out.println("[PASSWORD_RESET] Token generado para usuario: " + user.getUsername());
    }

    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);

        if (tokenOpt.isEmpty()) {
            System.out.println("[PASSWORD_RESET] Token no encontrado: " + token);
            return false;
        }

        PasswordResetToken resetToken = tokenOpt.get();

        // Validar token
        if (resetToken.isUsed()) {
            System.out.println("[PASSWORD_RESET] Token ya usado: " + token);
            return false;
        }

        if (resetToken.isExpired()) {
            System.out.println("[PASSWORD_RESET] Token expirado: " + token);
            return false;
        }

        // Actualizar contraseña
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Marcar token como usado
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        System.out.println("[PASSWORD_RESET] Contraseña actualizada para usuario: " + user.getUsername());
        return true;
    }

    public boolean validateToken(String token) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);

        if (tokenOpt.isEmpty()) {
            return false;
        }

        PasswordResetToken resetToken = tokenOpt.get();
        return !resetToken.isUsed() && !resetToken.isExpired();
    }

    @Scheduled(cron = "0 0 * * * *") // Ejecutar cada hora
    @Transactional
    public void cleanupExpiredTokens() {
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());
        System.out.println("[PASSWORD_RESET] Limpieza de tokens expirados completada");
    }

    // Helper para buscar usuario por email
    private Optional<User> findUserByEmail(String email) {
        return userRepository.findAll().stream()
                .filter(u -> email.equalsIgnoreCase(u.getEmail()))
                .findFirst();
    }
}
