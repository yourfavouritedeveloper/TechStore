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

        Email from = new Email("info.tech.store.ts@gmail.com");
        Email to = new Email(toEmail);

        String subject = "Your Verification Code";

        String htmlContent = "<!DOCTYPE html>" +
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
