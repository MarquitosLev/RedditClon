package com.RedditClon_Backend.RedditClon_Backend.controller;

import com.RedditClon_Backend.RedditClon_Backend.dto.CreateUserRequest;
import com.RedditClon_Backend.RedditClon_Backend.dto.UserDto;
import com.RedditClon_Backend.RedditClon_Backend.model.Role;
import com.RedditClon_Backend.RedditClon_Backend.model.User;
import com.RedditClon_Backend.RedditClon_Backend.repository.RoleRepository;
import com.RedditClon_Backend.RedditClon_Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDto> userDtos = users.stream()
                .map(user -> new UserDto(
                        user.getId(),
                        user.getUsername(),
                        user.getPassword(),
                        user.getCreatedAt(),
                        user.isEnabled(),
                        user.getRoles().stream().map(Role::getName).collect(Collectors.toSet())))
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDtos);
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
        try {
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "El nombre de usuario ya existe"));
            }

            User user = new User();
            user.setUsername(request.getUsername());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setEnabled(true);

            Set<Role> roles = new HashSet<>();
            Role userRole = roleRepository.findByName("USER")
                    .orElseThrow(() -> new RuntimeException("Error: Role USER is not found."));
            roles.add(userRole);

            if (request.isAdmin()) {
                Role adminRole = roleRepository.findByName("ADMIN")
                        .orElseThrow(() -> new RuntimeException("Error: Role ADMIN is not found."));
                roles.add(adminRole);
            }

            user.setRoles(roles);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Usuario creado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al crear usuario: " + e.getMessage()));
        }
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            user.setEnabled(!user.isEnabled());
            userRepository.save(user);

            String message = user.isEnabled() ? "Usuario reactivado exitosamente" : "Usuario suspendido exitosamente";
            return ResponseEntity.ok(Map.of(
                    "message", message,
                    "enabled", user.isEnabled()));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Error al cambiar estado del usuario: " + e.getMessage()));
        }
    }

}
