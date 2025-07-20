package com.bookinghomestay.app.domain.service;

public interface OtpTokenService {
    void saveOtp(String email, String otp, long expirationMinutes);
    boolean verifyOtp(String email, String otp);
    void invalidateOtp(String email);
}

