package com.RedditClon_Backend.RedditClon_Backend.dto;

import lombok.Data;

@Data
public class CreatePostRequest {
    private String title;
    private String body;
    private String authorUsername;  // recibido del front, validado contra sesión
    private String authorAvatar;    // URL de avatar (dicebear, etc.)
    private String mediaUrl;
    private String mediaType;
}
