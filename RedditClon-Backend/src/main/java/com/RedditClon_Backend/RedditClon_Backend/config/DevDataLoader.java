package com.RedditClon_Backend.RedditClon_Backend.config;

import com.RedditClon_Backend.RedditClon_Backend.model.Role;
import com.RedditClon_Backend.RedditClon_Backend.model.User;
import com.RedditClon_Backend.RedditClon_Backend.repository.RoleRepository;
import com.RedditClon_Backend.RedditClon_Backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
public class DevDataLoader {

    @Bean
    CommandLineRunner seedDefaultUser(RoleRepository roleRepo, UserRepository userRepo, PasswordEncoder encoder) {
        return args -> {
            // Ensure roles exist
            Role userRole = roleRepo.findByName("USER").orElseGet(() -> {
                Role r = new Role();
                r.setName("USER");
                return roleRepo.save(r);
            });
            Role adminRole = roleRepo.findByName("ADMIN").orElseGet(() -> {
                Role r = new Role();
                r.setName("ADMIN");
                return roleRepo.save(r);
            });

            // Seed normal user 'user' if missing
            userRepo.findByUsername("user").orElseGet(() -> {
                User user = User.builder()
                        .username("user")
                        .password(encoder.encode("password"))
                        .enabled(true)
                        .roles(Set.of(userRole))
                        .build();
                return userRepo.save(user);
            });

            // Seed admin user 'admin' if missing
            userRepo.findByUsername("admin").orElseGet(() -> {
                User admin = User.builder()
                        .username("admin")
                        .password(encoder.encode("admin"))
                        .enabled(true)
                        .roles(Set.of(adminRole))
                        .build();
                return userRepo.save(admin);
            });
        };
    }
}
