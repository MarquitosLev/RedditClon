package com.RedditClon_Backend.RedditClon_Backend.controller;

import com.RedditClon_Backend.RedditClon_Backend.dto.CreatePostRequest;
import com.RedditClon_Backend.RedditClon_Backend.dto.PostDto;
import com.RedditClon_Backend.RedditClon_Backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    /** GET /api/posts — devuelve todos los posts ordenados por fecha descendente */
    @GetMapping
    public ResponseEntity<List<PostDto>> getPosts() {
        try {
            List<PostDto> posts = postService.getAllPosts();
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            System.err.println("[POST] Error al obtener posts: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    /** POST /api/posts — crea un nuevo post (requiere sesión autenticada) */
    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody CreatePostRequest request,
                                        Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401)
                    .body(Map.of("success", false, "message", "No autenticado"));
        }

        if (request.getTitle() == null || request.getTitle().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "El título es obligatorio"));
        }

        try {
            PostDto created = postService.createPost(request, authentication.getName());
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            System.err.println("[POST] Error al crear post: " + e.getMessage());
            return ResponseEntity.status(500)
                    .body(Map.of("success", false, "message", "Error al crear el post"));
        }
    }
}
