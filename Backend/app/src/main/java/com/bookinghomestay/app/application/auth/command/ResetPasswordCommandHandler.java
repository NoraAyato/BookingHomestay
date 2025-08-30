package com.bookinghomestay.app.application.auth.command;

import com.bookinghomestay.app.api.dto.auth.AuthResponseDto;
import com.bookinghomestay.app.domain.exception.BusinessException;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.OtpTokenService;
import com.bookinghomestay.app.infrastructure.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ResetPasswordCommandHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpTokenService otpTokenService;

    public ResetPasswordCommandHandler(JwtTokenProvider jwtTokenProvider,
            IUserRepository userRepository,
            PasswordEncoder passwordEncoder, OtpTokenService otpTokenService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpTokenService = otpTokenService;
    }

    public void handle(ResetPasswordCommand command) {
        String userId;
        try {
            userId = jwtTokenProvider.getUserIdFromResetToken(command.getToken());
        } catch (Exception e) {
            throw new BusinessException("Token reset mật khẩu không hợp lệ hoặc đã hết hạn!");
        }
       
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new BusinessException("Người dùng không tồn tại!");
        }

        User user = userOptional.get();
        boolean isValid = otpTokenService.verifyOtp(user.getEmail(), command.getToken());
        if (!isValid) {
           throw new BusinessException("Token reset mật khẩu không hợp lệ hoặc đã hết hạn!");
        }
        otpTokenService.invalidateOtp(user.getEmail());
        String encodedPassword = passwordEncoder.encode(command.getNewPassword());
        user.setPassWord(encodedPassword);
        userRepository.save(user);
    }
}
