package com.bookinghomestay.app.application.auth.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GenerateOtpResponseDto {
    private String message;
    private String otp;
}
