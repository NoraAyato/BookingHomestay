package com.bookinghomestay.app.api.dto.Auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GoogleLoginRequestDto {
    @NotBlank
    private String idToken;
}
