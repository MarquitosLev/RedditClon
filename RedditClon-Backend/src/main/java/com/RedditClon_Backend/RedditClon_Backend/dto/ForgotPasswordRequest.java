package com.RedditClon_Backend.RedditClon_Backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgotPasswordRequest {
    @NotBlank(message = "El email es requerido")
    @Email(message = "Email inválido")
    private String email;
}
