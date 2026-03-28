package com.RedditClon_Backend.RedditClon_Backend.dto;

import com.RedditClon_Backend.RedditClon_Backend.model.Post;
import lombok.Data;

import java.time.format.DateTimeFormatter;

@Data
public class PostDto {

    private String id;
    private String authorUsername;
    private String authorAvatar;
    private String title;
    private String body;
    private String mediaUrl;
    private String mediaType;
    private String createdAt;
    private int upvotes;
    private int commentCount;

    public static PostDto from(Post post) {
        PostDto dto = new PostDto();
        dto.setId(String.valueOf(post.getId()));
        dto.setAuthorUsername(post.getAuthor().getUsername());
        // El avatar se guarda en mediaUrl del autor no existe en User, usamos dicebear
        // por defecto (cosas random)
        dto.setAuthorAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=" + post.getAuthor().getUsername());
        dto.setTitle(post.getTitle());
        dto.setBody(post.getBody());
        dto.setMediaUrl(post.getMediaUrl());
        dto.setMediaType(post.getMediaType());
        dto.setCreatedAt(post.getCreatedAt().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
        dto.setUpvotes(post.getUpvotes());
        dto.setCommentCount(post.getCommentCount());
        return dto;
    }
}
