package com.bookinghomestay.app.application.auth.command;

import org.springframework.stereotype.Component;

import com.bookinghomestay.app.domain.exception.BusinessException;
import com.bookinghomestay.app.domain.service.OtpTokenService;

@Component
public class VerifyOtpCommandHandler {

    private final OtpTokenService otpTokenService;

    public VerifyOtpCommandHandler(OtpTokenService otpTokenService) {
        this.otpTokenService = otpTokenService;
    }

    public void handle(VerifyOtpCommand command) {
        boolean isValid = otpTokenService.verifyOtp(command.getEmail(), command.getOtp());
        if (!isValid) {
            throw new BusinessException("OTP không hợp lệ hoặc đã hết hạn!");
        }
        otpTokenService.invalidateOtp(command.getEmail());
    }
}


