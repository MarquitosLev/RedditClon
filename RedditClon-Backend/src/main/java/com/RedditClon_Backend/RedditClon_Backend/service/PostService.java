package com.RedditClon_Backend.RedditClon_Backend.service;

import com.RedditClon_Backend.RedditClon_Backend.dto.CreatePostRequest;
import com.RedditClon_Backend.RedditClon_Backend.dto.PostDto;
import com.RedditClon_Backend.RedditClon_Backend.model.Post;
import com.RedditClon_Backend.RedditClon_Backend.model.User;
import com.RedditClon_Backend.RedditClon_Backend.repository.PostRepository;
import com.RedditClon_Backend.RedditClon_Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public List<PostDto> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(PostDto::from)
                .collect(Collectors.toList());
    }

    public PostDto createPost(CreatePostRequest request, String authenticatedUsername) {
        User author = userRepository.findByUsername(authenticatedUsername)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + authenticatedUsername));

        Post post = Post.builder()
                .title(request.getTitle())
                .body(request.getBody())
                .mediaUrl(request.getMediaUrl())
                .mediaType(request.getMediaType())
                .author(author)
                .build();

        Post saved = java.util.Objects.requireNonNull(postRepository.save(post), "Error al guardar el post");
        System.out.println("[POST] Nuevo post creado por '" + authenticatedUsername + "': " + saved.getTitle());
        return PostDto.from(saved);
    }
}
