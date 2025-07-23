package com.bookinghomestay.app.domain.service;

public interface RefreshTokenService {
    void save(String userId, String refreshToken, long expirationMinutes);

    String get(String userId);

    void invalidate(String userId);

    boolean isValid(String userId, String refreshToken);
}
