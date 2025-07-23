package com.bookinghomestay.app.application.auth.command;

import com.bookinghomestay.app.api.dto.Auth.AuthResponseDto;
import com.bookinghomestay.app.domain.exception.BusinessException;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.infrastructure.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ResetPasswordCommandHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ResetPasswordCommandHandler(JwtTokenProvider jwtTokenProvider,
            IUserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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
        String encodedPassword = passwordEncoder.encode(command.getNewPassword());
        user.setPassWord(encodedPassword);
        userRepository.save(user);
    }
}
