package com.bookinghomestay.app.application.auth.command;

import com.bookinghomestay.app.application.auth.dto.auth.AuthResponseDto;
import com.bookinghomestay.app.domain.exception.UnauthorizedException;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.RefreshTokenService;
import com.bookinghomestay.app.infrastructure.security.JwtTokenProvider;
import com.bookinghomestay.app.infrastructure.service.ActivityLogHelper;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginUserCommandHandler {

    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final ActivityLogHelper activityLogHelper;

    public AuthResponseDto handle(LoginUserCommand command) {
        User user = userRepository.findByEmail(command.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Không tìm thấy tài khoản !"));

        if (!passwordEncoder.matches(command.getPassword(), user.getPassWord())) {
            throw new UnauthorizedException("Sai tên đăng nhập hoặc mật khẩu !");
        }
        String accessToken = jwtTokenProvider.generateToken(user.getUserId(), user.getRole().getRoleName());
        if (command.isRememberMe()) {
            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUserId());
            refreshTokenService.save(user.getUserId(), refreshToken, 60 * 24 * 3);
            return new AuthResponseDto(accessToken, refreshToken);
        }
        activityLogHelper.logUserLogin(user.getUserName(), user.getUserId());
        return new AuthResponseDto(accessToken, null);
    }
}
