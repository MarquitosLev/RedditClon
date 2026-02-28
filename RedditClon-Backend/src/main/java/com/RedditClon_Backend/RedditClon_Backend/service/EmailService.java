package com.RedditClon_Backend.RedditClon_Backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.from:noreply@redditclon.com}")
    private String fromEmail;

    private final String FEEDBACK_RECIPIENT_EMAIL = "redditclonnotificacion@gmail.com";

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

    public void sendActivationEmail(String toEmail, String token) {
        String activationLink = frontendUrl + "/activate?token=" + token;
        String htmlBody = buildActivationEmailBody(activationLink);

        // 1. Intentar con SMTP (Gmail) — funciona con cualquier destinatario
        if (mailSender != null) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(fromEmail);
                helper.setTo(toEmail);
                helper.setSubject("Activá tu cuenta - RedditClon");
                helper.setText(htmlBody, true);
                mailSender.send(message);
                System.out.println("[EMAIL] Email de activación enviado via SMTP a: " + toEmail);
                return;
            } catch (Exception e) {
                System.err.println("[EMAIL] Error enviando activation email via SMTP: " + e.getMessage());
            }
        }

        // 2. Modo debug: loguear link en consola
        System.out.println("╔═══════════════════════════════════════════════════════════╗");
        System.out.println("║           EMAIL DE ACTIVACIÓN (MODO DEBUG)                ║");
        System.out.println("╠═══════════════════════════════════════════════════════════╣");
        System.out.println("║ Para: " + toEmail);
        System.out.println("║ Token: " + token);
        System.out.println("║ Link: " + activationLink);
        System.out.println("╚═══════════════════════════════════════════════════════════╝");
    }

    private String buildActivationEmailBody(String activationLink) {
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
                """
                .formatted(activationLink, activationLink, activationLink);
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetLink = frontendUrl + "/reset-password?token=" + token;

        // 1. Intentar con SMTP (Gmail) — funciona con cualquier destinatario
        if (mailSender != null) {
            try {
                String htmlBody = buildHtmlEmailBody(resetLink, token);
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(fromEmail);
                helper.setTo(toEmail);
                helper.setSubject("Recuperación de Contraseña - RedditClon");
                helper.setText(htmlBody, true);
                mailSender.send(message);
                System.out.println("[EMAIL] Email de recuperación enviado via SMTP a: " + toEmail);
                return;
            } catch (Exception e) {
                System.err.println("[EMAIL] Error enviando password reset email via SMTP: " + e.getMessage());
            }
        }

        // 2. Modo debug: loguear token en consola
        System.out.println("╔═══════════════════════════════════════════════════════════╗");
        System.out.println("║           EMAIL DE RECUPERACIÓN (MODO DEBUG)              ║");
        System.out.println("╠═══════════════════════════════════════════════════════════╣");
        System.out.println("║ Para: " + toEmail);
        System.out.println("║ Token: " + token);
        System.out.println("║ Link: " + resetLink);
        System.out.println("╚═══════════════════════════════════════════════════════════╝");
    }

    private String buildHtmlEmailBody(String resetLink, String token) {
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
                """
                .formatted(resetLink, resetLink, resetLink);
    }
}
