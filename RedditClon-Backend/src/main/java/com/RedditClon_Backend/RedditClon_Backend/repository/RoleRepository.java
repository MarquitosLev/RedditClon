package com.RedditClon_Backend.RedditClon_Backend.repository;

import com.RedditClon_Backend.RedditClon_Backend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
}
