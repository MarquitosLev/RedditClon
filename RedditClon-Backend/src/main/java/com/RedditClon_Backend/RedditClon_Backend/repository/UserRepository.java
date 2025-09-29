package com.RedditClon_Backend.RedditClon_Backend.repository;

import com.RedditClon_Backend.RedditClon_Backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
