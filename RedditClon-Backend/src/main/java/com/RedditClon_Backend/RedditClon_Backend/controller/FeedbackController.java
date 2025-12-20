package com.RedditClon_Backend.RedditClon_Backend.controller;

import com.RedditClon_Backend.RedditClon_Backend.service.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<String> sendFeedback(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            emailService.sendFeedback(title, description, file);
            return ResponseEntity.ok("Feedback sent successfully");
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error sending feedback: " + e.getMessage());
        }
    }
}
