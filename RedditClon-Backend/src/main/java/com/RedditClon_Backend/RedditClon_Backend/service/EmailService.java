package com.RedditClon_Backend.RedditClon_Backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@redditclon.com}")
    private String fromEmail;

    // Hardcoded recipient for feedback
    private final String FEEDBACK_RECIPIENT_EMAIL = "marcleiva623@gmail.com";

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public void sendFeedback(String title, String description, MultipartFile file) throws MessagingException {
        if (mailSender == null) {
            System.out.println("No email sender configuration found. Skipping email feedback send.");
            return;
        }

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(fromEmail);
        helper.setTo(FEEDBACK_RECIPIENT_EMAIL);
        helper.setSubject("New Feedback: " + title);

        String htmlContent = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #FF4500; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">RedditClon Feedback</h1>
                    </div>
                    <div style="padding: 30px; background-color: #f9f9f9;">
                        <h2 style="color: #333; margin-top: 0;">New Suggestion Received</h2>
                        <div style="background-color: white; padding: 20px; border-radius: 6px; border-left: 5px solid #FF4500; margin-bottom: 20px;">
                            <p style="margin: 0; color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Title</p>
                            <p style="margin: 5px 0 0; color: #333; font-size: 18px; font-weight: bold;">%s</p>
                        </div>
                        <div style="background-color: white; padding: 20px; border-radius: 6px; border-left: 5px solid #FF4500;">
                            <p style="margin: 0; color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Description</p>
                            <p style="margin: 10px 0 0; color: #333; line-height: 1.6;">%s</p>
                        </div>
                        <p style="margin-top: 30px; font-size: 12px; color: #999; text-align: center;">
                            This email was sent automatically from your RedditClon application.
                        </p>
                    </div>
                </div>
                """
                .formatted(title, description);

        helper.setText(htmlContent, true);

        if (file != null && !file.isEmpty()) {
            helper.addAttachment(file.getOriginalFilename(), file);
        }

        mailSender.send(message);
    }

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
