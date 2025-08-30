package com.bookinghomestay.app.application.auth.command;

import com.bookinghomestay.app.api.dto.auth.AuthResponseDto;
import com.bookinghomestay.app.domain.exception.UnauthorizedException;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.RefreshTokenService;
import com.bookinghomestay.app.infrastructure.security.JwtTokenProvider;

import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class RefreshTokenCommandHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final IUserRepository userRepository;

    public RefreshTokenCommandHandler(JwtTokenProvider jwtTokenProvider,
            RefreshTokenService refreshTokenService, IUserRepository userRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.refreshTokenService = refreshTokenService;
        this.userRepository = userRepository;
    }

    public AuthResponseDto handle(RefreshTokenCommand command) {
        String refreshToken = command.getRefreshToken();
        String userId;
        try {
            userId = jwtTokenProvider.getUserId(refreshToken);
        } catch (Exception e) {
            throw new UnauthorizedException("Token không hợp lệ hoặc sai định dạng");
        }

        Optional<User> userRecent = userRepository.findById(userId);

        if (!refreshTokenService.isValid(userRecent.get().getUserId(), refreshToken)) {
            throw new UnauthorizedException("Refresh token không hợp lệ");
        }

        String newAccessToken = jwtTokenProvider.generateToken(
                userId,
                userRecent.orElseThrow(() -> new UnauthorizedException("User không tồn tại")).getRole().getRoleName());

        // refreshTokenService.invalidate(userId);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(userId);
        refreshTokenService.save(userId, newRefreshToken, 60 * 24 * 3);
        System.out.println("RefreshToken: " + refreshToken);
        System.out.println("UserId from token: " + userId);
        System.out.println("Token tồn tại trong Redis: " + refreshTokenService.get(userId));
        System.out.println("Token so sánh: " + refreshToken.equals(refreshTokenService.get(userId)));

        return new AuthResponseDto(newAccessToken, newRefreshToken);
    }
}
