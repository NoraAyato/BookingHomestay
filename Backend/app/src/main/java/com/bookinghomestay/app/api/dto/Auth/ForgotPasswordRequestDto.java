package com.bookinghomestay.app.api.dto.Auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgotPasswordRequestDto {
    @NotBlank(message = "Email is required")
    private String email;
}