package com.bookinghomestay.app.application.auth.command;

import com.bookinghomestay.app.api.constant.Messages;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.EmailService;
import org.springframework.stereotype.Component;
import com.bookinghomestay.app.domain.service.OtpTokenService;
import java.util.Optional;
import java.util.Random;

@Component
public class ForgotPasswordCommandHandler {
    private final EmailService emailService;
    private final IUserRepository userService;
    private final OtpTokenService otpTokenService;

    public ForgotPasswordCommandHandler(EmailService emailService, IUserRepository userService,
            OtpTokenService otpTokenService) {
        this.emailService = emailService;
        this.userService = userService;
        this.otpTokenService = otpTokenService;
    }

    public String handle(ForgotPasswordCommand command) {
        Optional<User> userOptional = userService.findByEmail(command.getEmail());
        User user = userOptional
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản phù hợp với email trên !"));
        String userOtp = generateOTP();
        emailService.sendResetPasswordEmail(user.getEmail(), userOtp);
        otpTokenService.saveOtp(user.getEmail(), userOtp, 1);
        return Messages.FORGOT_PASSWORD_SUCCESS;
    }

    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // từ 100000 đến 999999
        return String.valueOf(otp);
    }

}