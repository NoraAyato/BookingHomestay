package com.bookinghomestay.app.application.auth.command;

import com.bookinghomestay.app.api.dto.Auth.AuthResponseDto;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.infrastructure.security.JwtTokenProvider;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class ChangePasswordCommandHandler {
    private final IUserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public ChangePasswordCommandHandler(IUserRepository userRepository, PasswordEncoder passwordEncoder,
            JwtTokenProvider JwtTokenProvider) {
        this.userRepo = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = JwtTokenProvider;
    }

    // handle change password when isLogin
    public AuthResponseDto handle(ChangePasswordCommand command) {
        Optional<User> userOptional = userRepo.findByEmail(command.getEmail());
        User user = userOptional
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với email này !"));

        if (!passwordEncoder.matches(command.getCurrentPassword(), user.getPassWord())) {
            throw new RuntimeException("Mật khẩu hiện tại không đúng !");
        }

        if (!command.getNewPassword().equals(command.getRePassword())) {
            throw new RuntimeException("Mật khẩu mới và xác nhận mật khẩu không khớp !");
        }
        user.setPassWord(passwordEncoder.encode(command.getNewPassword()));
        userRepo.save(user);
        String accessToken = jwtTokenProvider.generateToken(user.getUserId(), user.getRole().getRoleName());
        return new AuthResponseDto(accessToken, null);
    }
}