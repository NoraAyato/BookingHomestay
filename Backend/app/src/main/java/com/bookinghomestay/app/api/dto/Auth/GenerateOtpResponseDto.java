package com.bookinghomestay.app.api.dto.Auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GenerateOtpResponseDto {
    private String message;
    private String otp;
}
