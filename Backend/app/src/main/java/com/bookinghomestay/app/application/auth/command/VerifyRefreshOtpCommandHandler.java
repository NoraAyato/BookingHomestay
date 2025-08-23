package com.bookinghomestay.app.application.auth.command;

import org.springframework.stereotype.Component;

import com.bookinghomestay.app.api.dto.Auth.AuthResponseDto;
import com.bookinghomestay.app.domain.exception.BusinessException;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.OtpTokenService;
import com.bookinghomestay.app.infrastructure.security.JwtTokenProvider;

@Component
public class VerifyRefreshOtpCommandHandler {
    private final IUserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final OtpTokenService otpTokenService;

    public VerifyRefreshOtpCommandHandler(OtpTokenService otpTokenService, IUserRepository userRepository,
            JwtTokenProvider jwtTokenProvider) {
        this.otpTokenService = otpTokenService;
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponseDto handle(VerifyOtpCommand command) {
        boolean isValid = otpTokenService.verifyOtp(command.getEmail(), command.getOtp());
        if (!isValid) {
            throw new BusinessException("OTP không hợp lệ hoặc đã hết hạn!");
        }
        otpTokenService.invalidateOtp(command.getEmail());

        User user = userRepository.findByEmail(command.getEmail())
                .orElseThrow(() -> new BusinessException("Người dùng không tồn tại"));

        String resetPasswordToken = jwtTokenProvider.generateResetPasswordToken(user.getUserId());

        return new AuthResponseDto(resetPasswordToken, null);
    }
}
