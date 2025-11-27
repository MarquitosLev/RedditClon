package com.RedditClon_Backend.RedditClon_Backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.beans.factory.annotation.Autowired;
import com.RedditClon_Backend.RedditClon_Backend.repository.UserRepository;
import com.RedditClon_Backend.RedditClon_Backend.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = {  
        "http://localhost:5173",      // por si usás el front en localhost  
        "http://192.168.1.2:5173"     // front accedido por IP (host y Kali)  
    },  
    allowCredentials = "true"  
)
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/me")
    public Map<String, Object> me(Authentication authentication) {
        if (authentication == null) {
            return Map.of("authenticated", false);
        }
        String username = authentication.getName();
        Set<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());
        
        // Determinar si es admin
        boolean isAdmin = roles.contains("ROLE_ADMIN");
        
        return Map.of(
                "authenticated", true,
                "username", username,
                "roles", roles,
                "isAdmin", isAdmin,
                "userType", isAdmin ? "ADMIN" : "USER"
        );
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Buscar el usuario en la base de datos
            User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElse(null);

            if (user == null) {
                System.out.println("[LOGIN] Usuario '" + loginRequest.getUsername() + "' no encontrado");
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Usuario no encontrado"
                ));
            }

            // Verificar la contraseña
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                System.out.println("[LOGIN] Contraseña incorrecta para usuario '" + loginRequest.getUsername() + "'");
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Contraseña incorrecta"
                ));
            }

            // Si llegamos aquí, las credenciales son correctas
            // Crear token de autenticación y establecerlo en el contexto de seguridad
            UsernamePasswordAuthenticationToken authToken = 
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword());
            SecurityContextHolder.getContext().setAuthentication(authToken);

            // Determinar el tipo de usuario
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
                "userType", isAdmin ? "ADMIN" : "USER"
            ));

        } catch (Exception e) {
            System.out.println("[LOGIN] Error en login: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Error interno del servidor"
            ));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(Authentication authentication) {
        String username = authentication != null ? authentication.getName() : "desconocido";
        System.out.println("[LOGOUT] Usuario '" + username + "' ha cerrado sesión");
        
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Logout exitoso"
        ));
    }

    @GetMapping("/login")
    public ResponseEntity<Map<String, Object>> loginPage() {
        // Manejar peticiones GET a /login (incluyendo /login?logout)
        // Devolver 200 para evitar errores en la consola del frontend
        return ResponseEntity.ok(Map.of(
            "authenticated", false,
            "message", "No autenticado"
        ));
    }

    // Clase interna para el request de login
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
}
