package com.bookinghomestay.app.application.auth.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GoogleLoginRequestDto {
    @NotBlank
    private String idToken;
}
