package com.RedditClon_Backend.RedditClon_Backend.dto;

import java.time.LocalDateTime;
import java.util.Set;

public class UserDto {
    private Long id;
    private String username;
    private String password;
    private LocalDateTime createdAt;
    private boolean enabled;
    private Set<String> roles;

    public UserDto(Long id, String username, String password, LocalDateTime createdAt, boolean enabled,
            Set<String> roles) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.createdAt = createdAt;
        this.enabled = enabled;
        this.roles = roles;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public boolean isEnabled() {
        return enabled;
    }
}
