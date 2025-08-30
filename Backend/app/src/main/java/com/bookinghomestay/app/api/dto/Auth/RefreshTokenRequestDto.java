package com.bookinghomestay.app.api.dto.auth;

public class RefreshTokenRequestDto {
    private String refreshToken;

    // Getter & Setter
    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
