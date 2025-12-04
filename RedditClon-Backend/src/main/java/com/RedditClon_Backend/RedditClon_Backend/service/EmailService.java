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

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    // Hardcoded recipient as requested
    private final String RECIPIENT_EMAIL = "marcleiva623@gmail.com";

    public void sendFeedback(String title, String description, MultipartFile file) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(senderEmail);
        helper.setTo(RECIPIENT_EMAIL);
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

        javaMailSender.send(message);
    }
}
