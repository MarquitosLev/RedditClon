package com.RedditClon_Backend.RedditClon_Backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@redditclon.com}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String toEmail, String token) {
        try {
            String resetLink = frontendUrl + "/reset-password?token=" + token;
            String subject = "Recuperación de Contraseña - RedditClon";
            String body = buildEmailBody(resetLink, token);

            if (mailSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(body);

                mailSender.send(message);
                System.out.println("[EMAIL] Email de recuperación enviado a: " + toEmail);
            } else {
                // Si no hay configuración SMTP, solo loguear
                System.out.println("╔═══════════════════════════════════════════════════════════╗");
                System.out.println("║           EMAIL DE RECUPERACIÓN (MODO DEBUG)              ║");
                System.out.println("╠═══════════════════════════════════════════════════════════╣");
                System.out.println("║ Para: " + toEmail);
                System.out.println("║ Token: " + token);
                System.out.println("║ Link: " + resetLink);
                System.out.println("╚═══════════════════════════════════════════════════════════╝");
            }
        } catch (Exception e) {
            System.err.println("[EMAIL] Error enviando email: " + e.getMessage());
            // Loguear el token de todas formas para debugging
            System.out.println("[EMAIL DEBUG] Token para " + toEmail + ": " + token);
        }
    }

    private String buildEmailBody(String resetLink, String token) {
        return """
                Hola,

                Hemos recibido una solicitud para restablecer tu contraseña en RedditClon.

                Para restablecer tu contraseña, haz clic en el siguiente enlace:
                %s

                O copia y pega este token en la página de recuperación:
                %s

                Este enlace expirará en 30 minutos.

                Si no solicitaste este cambio, ignora este correo.

                Saludos,
                El equipo de RedditClon
                """.formatted(resetLink, token);
    }
}
