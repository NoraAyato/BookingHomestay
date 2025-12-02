package com.bookinghomestay.app.application.auth.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthCallbackResult {
    private boolean success;
    private String errorMessage;
    private AuthResponseDto authResponse;

    public static AuthCallbackResult success(AuthResponseDto authResponse) {
        return new AuthCallbackResult(true, null, authResponse);
    }

    public static AuthCallbackResult failure(String errorMessage) {
        return new AuthCallbackResult(false, errorMessage, null);
    }
}
