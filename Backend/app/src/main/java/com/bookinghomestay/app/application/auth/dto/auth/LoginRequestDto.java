package com.bookinghomestay.app.application.auth.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestDto {
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private boolean rememberMe;

}
