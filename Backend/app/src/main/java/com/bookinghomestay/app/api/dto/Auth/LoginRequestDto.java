package com.bookinghomestay.app.api.dto.auth;

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
