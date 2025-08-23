package com.bookinghomestay.app.application.auth.command;

import com.bookinghomestay.app.api.constant.Messages;
import com.bookinghomestay.app.api.dto.Auth.GenerateOtpResponseDto;
import com.bookinghomestay.app.domain.exception.ResourceNotFoundException;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.EmailService;
import com.bookinghomestay.app.domain.service.OtpTokenService;

import lombok.RequiredArgsConstructor;

import java.util.Random;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GenerateOtpCommandHandler {

    private final EmailService emailService;
    private final OtpTokenService otpTokenService;
    private final IUserRepository userService;

    public GenerateOtpResponseDto handle(GenerateOtpCommand command) {
        var userOpt = userService.findByEmail(command.getEmail());
        if (userOpt.isPresent()) {
            throw new ResourceNotFoundException("Người dùng đã tồn tại !");
        }
        String otp = generateOTP();
        String message = Messages.SEND_OTP_SUCCESS;
        emailService.sendResetPasswordEmail(command.getEmail(), otp);
        otpTokenService.saveOtp(command.getEmail(), otp, 1);
        return new GenerateOtpResponseDto(message, otp);
    }

    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // từ 100000 đến 999999
        return String.valueOf(otp);
    }
}
