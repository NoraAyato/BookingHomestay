package com.bookinghomestay.app.domain.service;

public interface EmailService {
    void sendResetPasswordEmail(String to, String resetLink);

    void sendVerifyOtp(String to, String otp);
}