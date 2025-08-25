package com.bookinghomestay.app.application.auth.command;

import com.bookinghomestay.app.api.constant.Messages;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.EmailService;
import org.springframework.stereotype.Component;
import com.bookinghomestay.app.domain.service.OtpTokenService;
import com.bookinghomestay.app.infrastructure.security.JwtTokenProvider;

import java.util.Optional;
import java.util.Random;

@Component
public class ForgotPasswordCommandHandler {
    private final EmailService emailService;
    private final IUserRepository userService;
    private final OtpTokenService otpTokenService;
    private final JwtTokenProvider jwtTokenProvider;

    public ForgotPasswordCommandHandler(EmailService emailService, IUserRepository userService,
            OtpTokenService otpTokenService, JwtTokenProvider jwtTokenProvider) {
        this.emailService = emailService;
        this.userService = userService;
        this.otpTokenService = otpTokenService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public void handle(ForgotPasswordCommand command) {
        Optional<User> userOptional = userService.findByEmail(command.getEmail());
        User user = userOptional
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản phù hợp với email trên !"));
        String resetPasswordToken = jwtTokenProvider.generateResetPasswordToken(user.getUserId());
        emailService.sendResetPasswordEmail(user.getEmail(), resetPasswordToken);
        otpTokenService.saveOtp(user.getEmail(), resetPasswordToken, 1);
    }
}