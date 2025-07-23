package com.bookinghomestay.app.application.auth.command;

import com.bookinghomestay.app.api.dto.Auth.AuthResponseDto;
import com.bookinghomestay.app.domain.exception.UnauthorizedException;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.RefreshTokenService;
import com.bookinghomestay.app.infrastructure.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginUserCommandHandler {

    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;

    public LoginUserCommandHandler(IUserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider, RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.refreshTokenService = refreshTokenService;
    }

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
        return new AuthResponseDto(accessToken, null);
    }
}
