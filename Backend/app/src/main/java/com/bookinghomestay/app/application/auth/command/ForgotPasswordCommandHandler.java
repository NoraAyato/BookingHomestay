package com.bookinghomestay.app.application.auth.command;

import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.EmailService;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.Random;

@Component
public class ForgotPasswordCommandHandler {
    private final EmailService emailService;
    private final IUserRepository userService;

    public ForgotPasswordCommandHandler(EmailService emailService, IUserRepository userService) {
        this.emailService = emailService;
        this.userService = userService;
    }

    public String handle(ForgotPasswordCommand command) {
        Optional<User> userOptional = userService.findByEmail(command.getEmail());
        User user = userOptional.orElseThrow(() -> 
            new IllegalArgumentException("Không tìm thấy tài khoản phù hợp với email trên !")
        );
        String userOtp = generateOTP();
        emailService.sendResetPasswordEmail(user.getEmail(), userOtp);
        return "Mã Otp đã được gửi vào email của bạn !";
    }

    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // từ 100000 đến 999999
        return String.valueOf(otp);
    }

}