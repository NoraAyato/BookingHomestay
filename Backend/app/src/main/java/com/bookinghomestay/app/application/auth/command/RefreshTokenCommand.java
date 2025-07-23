package com.bookinghomestay.app.application.auth.command;

public class RefreshTokenCommand {
    private final String refreshToken;

    public RefreshTokenCommand(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }
}
