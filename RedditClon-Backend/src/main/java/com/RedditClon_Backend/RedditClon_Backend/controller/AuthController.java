package com.RedditClon_Backend.RedditClon_Backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.beans.factory.annotation.Autowired;
import com.RedditClon_Backend.RedditClon_Backend.repository.UserRepository;
import com.RedditClon_Backend.RedditClon_Backend.repository.RoleRepository;
import com.RedditClon_Backend.RedditClon_Backend.repository.AccountActivationTokenRepository;
import com.RedditClon_Backend.RedditClon_Backend.model.User;
import com.RedditClon_Backend.RedditClon_Backend.model.Role;
import com.RedditClon_Backend.RedditClon_Backend.model.AccountActivationToken;
import com.RedditClon_Backend.RedditClon_Backend.service.EmailService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.core.context.SecurityContext;

import com.RedditClon_Backend.RedditClon_Backend.service.PasswordResetService;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private RoleRepository roleRepository;

        @Autowired
        private AccountActivationTokenRepository activationTokenRepository;

        @Autowired
        private EmailService emailService;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Autowired
        private PasswordResetService passwordResetService;

        private SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

        @GetMapping("/me")
        public Map<String, Object> me(Authentication authentication) {
                if (authentication == null) {
                        return Map.of("authenticated", false);
                }
                String username = authentication.getName();
                Set<String> roles = authentication.getAuthorities().stream()
                                .map(GrantedAuthority::getAuthority)
                                .collect(Collectors.toSet());

                boolean isAdmin = roles.contains("ROLE_ADMIN");

                return Map.of(
                                "authenticated", true,
                                "username", username,
                                "roles", roles,
                                "isAdmin", isAdmin,
                                "userType", isAdmin ? "ADMIN" : "USER");
        }

        @PostMapping("/login")
        public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest,
                        HttpServletRequest request,
                        HttpServletResponse response) {
                try {
                        User user = userRepository.findByUsername(loginRequest.getUsername())
                                        .orElse(null);

                        if (user == null) {
                                System.out.println(
                                                "[LOGIN] Usuario '" + loginRequest.getUsername() + "' no encontrado");
                                return ResponseEntity.status(401).body(Map.of(
                                                "success", false,
                                                "message", "Usuario no encontrado"));
                        }

                        if (!user.isEnabled()) {
                                System.out.println(
                                                "[LOGIN] Usuario '" + loginRequest.getUsername() + "' está suspendido");
                                return ResponseEntity.status(401).body(Map.of(
                                                "success", false,
                                                "message", "La cuenta con la que quiere ingresar fue suspendida"));
                        }

                        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                                System.out.println("[LOGIN] Contraseña incorrecta para usuario '"
                                                + loginRequest.getUsername() + "'");
                                return ResponseEntity.status(401).body(Map.of(
                                                "success", false,
                                                "message", "Contraseña incorrecta"));
                        }

                        Set<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                                        .collect(Collectors.toSet());

                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                        user.getUsername(), user.getPassword(), authorities);

                        SecurityContext context = SecurityContextHolder.createEmptyContext();
                        context.setAuthentication(authToken);
                        SecurityContextHolder.setContext(context);

                        securityContextRepository.saveContext(context, request, response);

                        boolean isAdmin = user.getRoles().stream()
                                        .anyMatch(role -> role.getName().equals("ADMIN"));

                        System.out.println("[LOGIN] Usuario '" + user.getUsername() + "' ha iniciado sesión como " +
                                        (isAdmin ? "ADMIN" : "USER"));

                        return ResponseEntity.ok(Map.of(
                                        "success", true,
                                        "message", "Login exitoso",
                                        "username", user.getUsername(),
                                        "roles", user.getRoles().stream()
                                                        .map(role -> "ROLE_" + role.getName())
                                                        .collect(Collectors.toSet()),
                                        "isAdmin", isAdmin,
                                        "userType", isAdmin ? "ADMIN" : "USER"));

                } catch (Exception e) {
                        System.out.println("[LOGIN] Error en login: " + e.getMessage());
                        e.printStackTrace();
                        return ResponseEntity.status(500).body(Map.of(
                                        "success", false,
                                        "message", "Error interno del servidor"));
                }
        }

        @PostMapping("/logout")
        public ResponseEntity<Map<String, Object>> logout(Authentication authentication) {
                String username = authentication != null ? authentication.getName() : "desconocido";
                System.out.println("[LOGOUT] Usuario '" + username + "' ha cerrado sesión");

                SecurityContextHolder.clearContext();
                return ResponseEntity.ok(Map.of(
                                "success", true,
                                "message", "Logout exitoso"));
        }

        @GetMapping("/login")
        public ResponseEntity<Map<String, Object>> loginPage() {
                return ResponseEntity.ok(Map.of(
                                "authenticated", false,
                                "message", "No autenticado"));
        }

        // ==================== Registro de Usuario ====================

        @PostMapping("/auth/register")
        public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {
                try {
                        if (request.getUsername() == null || request.getUsername().isBlank()) {
                                return ResponseEntity.badRequest().body(Map.of("success", false, "message",
                                                "El nombre de usuario es requerido"));
                        }
                        if (request.getEmail() == null || request.getEmail().isBlank()) {
                                return ResponseEntity.badRequest()
                                                .body(Map.of("success", false, "message", "El email es requerido"));
                        }
                        if (request.getPassword() == null || request.getPassword().isBlank()) {
                                return ResponseEntity.badRequest().body(
                                                Map.of("success", false, "message", "La contraseña es requerida"));
                        }

                        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                                return ResponseEntity.badRequest().body(Map.of("success", false, "message",
                                                "El nombre de usuario ya está en uso"));
                        }
                        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                                return ResponseEntity.badRequest().body(
                                                Map.of("success", false, "message", "El email ya está registrado"));
                        }

                        // Crear usuario suspendido (enabled = false) hasta activar por email
                        User user = new User();
                        user.setUsername(request.getUsername());
                        user.setEmail(request.getEmail());
                        user.setPassword(passwordEncoder.encode(request.getPassword()));
                        user.setEnabled(false);

                        Set<Role> roles = new HashSet<>();
                        Role userRole = roleRepository.findByName("USER")
                                        .orElseThrow(() -> new RuntimeException("Role USER not found"));
                        roles.add(userRole);
                        user.setRoles(roles);

                        userRepository.save(user);

                        // Generar token de activación
                        String token = UUID.randomUUID().toString();
                        AccountActivationToken activationToken = AccountActivationToken.builder()
                                        .token(token)
                                        .user(user)
                                        .expiresAt(LocalDateTime.now().plusHours(24))
                                        .build();
                        activationTokenRepository.save(activationToken);

                        // Enviar email de activación
                        emailService.sendActivationEmail(request.getEmail(), token);

                        System.out.println("[REGISTER] Nuevo usuario registrado: " + user.getUsername() + " ("
                                        + user.getEmail() + ")");

                        return ResponseEntity.ok(Map.of(
                                        "success", true,
                                        "message", "Cuenta creada exitosamente. Revisá tu email para activarla."));
                } catch (Exception e) {
                        System.err.println("[REGISTER] Error: " + e.getMessage());
                        return ResponseEntity.status(500).body(Map.of(
                                        "success", false,
                                        "message", "Error al registrar usuario: " + e.getMessage()));
                }
        }

        @GetMapping("/auth/activate/{token}")
        public ResponseEntity<Map<String, Object>> activateAccount(@PathVariable String token) {
                try {
                        AccountActivationToken activationToken = activationTokenRepository.findByToken(token)
                                        .orElse(null);

                        if (activationToken == null) {
                                return ResponseEntity.badRequest().body(Map.of(
                                                "success", false,
                                                "message", "Token de activación inválido"));
                        }

                        if (activationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
                                activationTokenRepository.delete(activationToken);
                                return ResponseEntity.badRequest().body(Map.of(
                                                "success", false,
                                                "message",
                                                "El enlace de activación ha expirado. Registrate nuevamente."));
                        }

                        User user = activationToken.getUser();
                        user.setEnabled(true);
                        userRepository.save(user);

                        activationTokenRepository.delete(activationToken);

                        System.out.println("[ACTIVATE] Cuenta activada para: " + user.getUsername());

                        return ResponseEntity.ok(Map.of(
                                        "success", true,
                                        "message", "Cuenta activada exitosamente. Ya podés iniciar sesión."));
                } catch (Exception e) {
                        System.err.println("[ACTIVATE] Error: " + e.getMessage());
                        return ResponseEntity.status(500).body(Map.of(
                                        "success", false,
                                        "message", "Error al activar la cuenta"));
                }
        }

        // ==================== Password Reset Endpoints ====================

        @PostMapping("/auth/forgot-password")
        public ResponseEntity<Map<String, Object>> forgotPassword(
                        @RequestBody com.RedditClon_Backend.RedditClon_Backend.dto.ForgotPasswordRequest request) {
                try {
                        passwordResetService.requestPasswordReset(request.getEmail());
                        return ResponseEntity.ok(Map.of(
                                        "success", true,
                                        "message",
                                        "Si el email existe, recibirás un correo con instrucciones para restablecer tu contraseña"));
                } catch (Exception e) {
                        System.err.println("[FORGOT_PASSWORD] Error: " + e.getMessage());
                        return ResponseEntity.status(500).body(Map.of(
                                        "success", false,
                                        "message", "Error al procesar la solicitud"));
                }
        }

        @PostMapping("/auth/reset-password")
        public ResponseEntity<Map<String, Object>> resetPassword(
                        @RequestBody com.RedditClon_Backend.RedditClon_Backend.dto.ResetPasswordRequest request) {
                try {
                        boolean success = passwordResetService.resetPassword(request.getToken(),
                                        request.getNewPassword());
                        if (success) {
                                return ResponseEntity.ok(Map.of(
                                                "success", true,
                                                "message", "Contraseña actualizada exitosamente"));
                        } else {
                                return ResponseEntity.status(400).body(Map.of(
                                                "success", false,
                                                "message", "Token inválido o expirado"));
                        }
                } catch (Exception e) {
                        System.err.println("[RESET_PASSWORD] Error: " + e.getMessage());
                        return ResponseEntity.status(500).body(Map.of(
                                        "success", false,
                                        "message", "Error al restablecer la contraseña"));
                }
        }

        @GetMapping("/auth/validate-token/{token}")
        public ResponseEntity<Map<String, Object>> validateToken(@PathVariable String token) {
                boolean valid = passwordResetService.validateToken(token);
                return ResponseEntity.ok(Map.of(
                                "valid", valid,
                                "message", valid ? "Token válido" : "Token inválido o expirado"));
        }

        // ==================== Inner Request Classes ====================

        public static class LoginRequest {
                private String username;
                private String password;

                public String getUsername() {
                        return username;
                }

                public void setUsername(String username) {
                        this.username = username;
                }

                public String getPassword() {
                        return password;
                }

                public void setPassword(String password) {
                        this.password = password;
                }
        }

        public static class RegisterRequest {
                private String username;
                private String email;
                private String password;

                public String getUsername() {
                        return username;
                }

                public void setUsername(String username) {
                        this.username = username;
                }

                public String getEmail() {
                        return email;
                }

                public void setEmail(String email) {
                        this.email = email;
                }

                public String getPassword() {
                        return password;
                }

                public void setPassword(String password) {
                        this.password = password;
                }
        }
}
