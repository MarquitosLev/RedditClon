package com.RedditClon_Backend.RedditClon_Backend.service;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
public class EmailService {

    @Value("${BREVO_API_KEY:}")
    private String brevoApiKey;

    @Value("${BREVO_FROM_EMAIL:noreply@redditclon.com}")
    private String fromEmail;

    @Value("${APP_FRONTEND_URL:http://localhost:5173}")
    private String frontendUrl;

    private final String FEEDBACK_RECIPIENT_EMAIL = "redditclonnotificacion@gmail.com";
    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    private final RestTemplate restTemplate = new RestTemplate();

    // ─── Feedback ────────────────────────────────────────────────────────────

    public void sendFeedback(String title, String description, MultipartFile file) throws MessagingException {
        if (brevoApiKey == null || brevoApiKey.isBlank()) {
            System.out.println("[EMAIL] No Brevo API key configured. Skipping feedback email.");
            return;
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("sender",  Map.of("name", "RedditClon Feedback", "email", fromEmail));
        payload.put("to",      List.of(Map.of("email", FEEDBACK_RECIPIENT_EMAIL, "name", "RedditClon Admin")));
        payload.put("subject", "New Feedback: " + title);
        payload.put("htmlContent", buildFeedbackHtml(title, description));

        if (file != null && !file.isEmpty()) {
            try {
                String encoded = Base64.getEncoder().encodeToString(file.getBytes());
                payload.put("attachment", List.of(Map.of(
                        "content", encoded,
                        "name",    file.getOriginalFilename()
                )));
            } catch (Exception e) {
                System.err.println("[EMAIL] Error encoding attachment: " + e.getMessage());
            }
        }

        sendRequest(payload);
    }

    // ─── Activation email ────────────────────────────────────────────────────

    public void sendActivationEmail(String toEmail, String token) {
        if (brevoApiKey == null || brevoApiKey.isBlank()) {
            logDebug("ACTIVACIÓN", toEmail, token, frontendUrl + "/activate?token=" + token);
            return;
        }

        String activationLink = frontendUrl + "/activate?token=" + token;

        Map<String, Object> payload = new HashMap<>();
        payload.put("sender",      Map.of("name", "RedditClon", "email", fromEmail));
        payload.put("to",          List.of(Map.of("email", toEmail)));
        payload.put("subject",     "Activá tu cuenta - RedditClon");
        payload.put("htmlContent", buildActivationHtml(activationLink));

        try {
            sendRequest(payload);
            System.out.println("[EMAIL] Email de activación enviado via Brevo API a: " + toEmail);
        } catch (Exception e) {
            System.err.println("[EMAIL] Error enviando activation email: " + e.getMessage());
            logDebug("ACTIVACIÓN", toEmail, token, activationLink);
        }
    }

    // ─── Password reset ──────────────────────────────────────────────────────

    public void sendPasswordResetEmail(String toEmail, String token) {
        if (brevoApiKey == null || brevoApiKey.isBlank()) {
            logDebug("RECUPERACIÓN", toEmail, token, frontendUrl + "/reset-password?token=" + token);
            return;
        }

        String resetLink = frontendUrl + "/reset-password?token=" + token;

        Map<String, Object> payload = new HashMap<>();
        payload.put("sender",      Map.of("name", "RedditClon", "email", fromEmail));
        payload.put("to",          List.of(Map.of("email", toEmail)));
        payload.put("subject",     "Recuperación de Contraseña - RedditClon");
        payload.put("htmlContent", buildPasswordResetHtml(resetLink));

        try {
            sendRequest(payload);
            System.out.println("[EMAIL] Email de recuperación enviado via Brevo API a: " + toEmail);
        } catch (Exception e) {
            System.err.println("[EMAIL] Error enviando password reset email: " + e.getMessage());
            logDebug("RECUPERACIÓN", toEmail, token, resetLink);
        }
    }

    // ─── HTTP helper ─────────────────────────────────────────────────────────

    private void sendRequest(Map<String, Object> payload) throws MessagingException {
        HttpHeaders headers = new HttpHeaders();
        headers.set("api-key", brevoApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(BREVO_API_URL, entity, String.class);
            System.out.println("[EMAIL] Brevo API response: " + response.getStatusCode());
        } catch (Exception e) {
            System.err.println("[EMAIL] Brevo API error: " + e.getMessage());
            throw new MessagingException("Failed to send email via Brevo API: " + e.getMessage(), e);
        }
    }

    // ─── Debug fallback ──────────────────────────────────────────────────────

    private void logDebug(String type, String email, String token, String link) {
        System.out.println("╔══════════════════════════════════════════════════════════╗");
        System.out.println("║           EMAIL DE " + type + " (MODO DEBUG)");
        System.out.println("╠══════════════════════════════════════════════════════════╣");
        System.out.println("║ Para:  " + email);
        System.out.println("║ Token: " + token);
        System.out.println("║ Link:  " + link);
        System.out.println("╚══════════════════════════════════════════════════════════╝");
    }

    // ─── HTML builders ───────────────────────────────────────────────────────

    private String buildFeedbackHtml(String title, String description) {
        return """
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
                """.formatted(title, description);
    }

    private String buildActivationHtml(String activationLink) {
        return """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 40px 20px;">
                    <div style="background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                        <div style="background-color: #FF4500; padding: 30px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 1px;">RedditClon</h1>
                            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Activá tu cuenta</p>
                        </div>
                        <div style="padding: 40px 30px;">
                            <h2 style="color: #1a1a1a; margin-top: 0;">¡Bienvenido/a!</h2>
                            <p style="color: #555; line-height: 1.6;">
                                Gracias por registrarte en RedditClon. Para completar el proceso y activar tu cuenta,
                                hacé clic en el botón de abajo.
                            </p>
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="%s"
                                   style="background-color: #FF4500; color: white; padding: 14px 32px;
                                          text-decoration: none; border-radius: 8px; font-size: 16px;
                                          font-weight: bold; display: inline-block;">
                                    Activar Cuenta
                                </a>
                            </div>
                            <p style="color: #888; font-size: 13px; line-height: 1.5;">
                                Si el botón no funciona, copiá este enlace en tu navegador:<br>
                                <a href="%s" style="color: #FF4500; word-break: break-all;">%s</a>
                            </p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                            <p style="color: #aaa; font-size: 12px; text-align: center; margin: 0;">
                                Este enlace expirará en <strong>24 horas</strong>.<br>
                                Si no creaste esta cuenta, podés ignorar este correo.
                            </p>
                        </div>
                    </div>
                </div>
                """.formatted(activationLink, activationLink, activationLink);
    }

    private String buildPasswordResetHtml(String resetLink) {
        return """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 40px 20px;">
                    <div style="background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                        <div style="background-color: #FF4500; padding: 30px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 1px;">RedditClon</h1>
                            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Recuperación de Contraseña</p>
                        </div>
                        <div style="padding: 40px 30px;">
                            <h2 style="color: #1a1a1a; margin-top: 0;">¿Olvidaste tu contraseña?</h2>
                            <p style="color: #555; line-height: 1.6;">
                                Recibimos una solicitud para restablecer la contraseña de tu cuenta.
                                Hacé clic en el botón de abajo para crear una nueva contraseña.
                            </p>
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="%s"
                                   style="background-color: #FF4500; color: white; padding: 14px 32px;
                                          text-decoration: none; border-radius: 8px; font-size: 16px;
                                          font-weight: bold; display: inline-block;">
                                    Restablecer Contraseña
                                </a>
                            </div>
                            <p style="color: #888; font-size: 13px; line-height: 1.5;">
                                Si el botón no funciona, copiá este enlace en tu navegador:<br>
                                <a href="%s" style="color: #FF4500; word-break: break-all;">%s</a>
                            </p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                            <p style="color: #aaa; font-size: 12px; text-align: center; margin: 0;">
                                Este enlace expirará en <strong>30 minutos</strong>.<br>
                                Si no solicitaste este cambio, podés ignorar este correo.
                            </p>
                        </div>
                    </div>
                </div>
                """.formatted(resetLink, resetLink, resetLink);
    }
}
