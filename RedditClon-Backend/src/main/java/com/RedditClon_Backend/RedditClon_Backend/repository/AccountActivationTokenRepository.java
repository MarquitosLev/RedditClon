package com.RedditClon_Backend.RedditClon_Backend.repository;

import com.RedditClon_Backend.RedditClon_Backend.model.AccountActivationToken;
import com.RedditClon_Backend.RedditClon_Backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountActivationTokenRepository extends JpaRepository<AccountActivationToken, Long> {
    Optional<AccountActivationToken> findByToken(String token);

    void deleteByUser(User user);
}
