package com.tech.store.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtp(String toEmail, String otp) throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");

        String htmlMsg = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "  body { font-family: Arial, sans-serif; margin: 0; padding: 0; }" +
                "  .container { background-color: #60a5fa; padding: 50px 0; text-align: center; }" +
                "  .card { background-color: #ffffff; border-radius: 25px; display: inline-block; padding: 40px 30px; margin-top: -50px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }" +
                "  h1 { color: #1e3a8a; }" +
                "  p { color: #334155; font-size: 16px; }" +
                "  .otp { font-size: 32px; font-weight: bold; color: #1e3a8a; margin: 20px 0; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "  <div class='container'>" +
                "    <div class='card'>" +
                "      <h1>Your Verification Code</h1>" +
                "      <p>Use the following OTP to verify your account:</p>" +
                "      <div class='otp'>" + otp + "</div>" +
                "      <p>If you did not request this, please ignore this email.</p>" +
                "    </div>" +
                "  </div>" +
                "</body>" +
                "</html>";

        helper.setText(htmlMsg, true); // true = HTML
        helper.setTo(toEmail);
        helper.setSubject("Your Verification Code");
        mailSender.send(message);
    }

    public String generateOtp() {
        Random random = new Random();
        int number = 100000 + random.nextInt(900000);
        return String.valueOf(number);
    }
}
