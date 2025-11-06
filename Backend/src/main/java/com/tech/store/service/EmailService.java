package com.tech.store.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${sendgrid.api-key}")
    private String sendGridApiKey;

    @PostConstruct
    public void checkApiKey() {
        if (sendGridApiKey == null || sendGridApiKey.isEmpty()) {
            System.err.println("SENDGRID_API_KEY is NOT set!");
            throw new IllegalStateException("SENDGRID_API_KEY must be provided in environment variables or application.yml");
        } else {
            System.out.println("SENDGRID_API_KEY loaded successfully");
        }
    }

    public void sendOtp(String toEmail, String otp) throws IOException {
        String subject = "Your Verification Code";
        String htmlContent = "<!DOCTYPE html>" +
                "<html><head><style>" +
                "body { font-family: Arial, sans-serif; margin:0; padding:0; background:#f3f4f6; }" +
                ".container { text-align:center; padding:50px 0; }" +
                ".card { background:white; border-radius:25px; display:inline-block; padding:40px 30px; box-shadow:0 4px 6px rgba(0,0,0,0.1); }" +
                "h1 { color:#1e3a8a; } p { color:#334155; font-size:16px; }" +
                ".otp { font-size:32px; font-weight:bold; color:#1e3a8a; margin:20px 0; }" +
                "</style></head><body>" +
                "<div class='container'><div class='card'>" +
                "<h1>Your Verification Code</h1>" +
                "<p>Use the following OTP to verify your account:</p>" +
                "<div class='otp'>" + otp + "</div>" +
                "<p>If you did not request this, please ignore this email.</p>" +
                "</div></div></body></html>";

        sendEmail(toEmail, subject, htmlContent);
    }


    public void sendPasswordReset(String toEmail) throws IOException {
        String subject = "Reset Your TechStore Password";
        String resetLink = "https://yourfavouritedeveloper.github.io/TechStore/#/recover";

        String htmlContent = "<!DOCTYPE html>" +
                "<html><head><style>" +
                "body { font-family: Arial, sans-serif; margin:0; padding:0; background:#f9fafb; }" +
                ".container { text-align:center; padding:60px 0; }" +
                ".card { background:white; border-radius:25px; display:inline-block; padding:50px 40px; box-shadow:0 6px 12px rgba(0,0,0,0.1); }" +
                "h1 { color:#2563eb; } p { color:#334155; font-size:16px; line-height:1.5; }" +
                ".button { display:inline-block; margin-top:25px; padding:12px 25px; background:#2563eb; color:white; text-decoration:none; border-radius:8px; font-weight:bold; transition:background 0.3s; }" +
                ".button:hover { background:#1d4ed8; }" +
                "</style></head><body>" +
                "<div class='container'><div class='card'>" +
                "<h1>Reset Your Password</h1>" +
                "<p>We received a request to reset your TechStore password.</p>" +
                "<p>Click the button below to set a new password:</p>" +
                "<a href='" + resetLink + "' class='button'>Reset Password</a>" +
                "<p style='margin-top:25px;font-size:13px;color:#64748b;'>If you didn’t request this, you can safely ignore this email.</p>" +
                "</div></div></body></html>";

        sendEmail(toEmail, subject, htmlContent);
    }


    private void sendEmail(String toEmail, String subject, String htmlContent) throws IOException {
        Email from = new Email("info.tech.store.ts@gmail.com");
        Email to = new Email(toEmail);
        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            if (response.getStatusCode() >= 400) {
                throw new IOException("SendGrid Error: " + response.getBody());
            }

        } catch (IOException ex) {
            throw new IOException("Failed to send email: " + ex.getMessage(), ex);
        }
    }


    public String generateOtp() {
        Random random = new Random();
        int number = 100000 + random.nextInt(900000);
        return String.valueOf(number);
    }
}
