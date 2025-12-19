package com.bookinghomestay.app.application.auth.command;

import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.model.UserLogin;
import com.bookinghomestay.app.domain.repository.IUserLoginRepository;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.RefreshTokenService;
import com.bookinghomestay.app.infrastructure.security.JwtTokenProvider;
import com.bookinghomestay.app.infrastructure.service.ActivityLogHelper;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.auth.dto.auth.AuthResponseDto;
import com.bookinghomestay.app.common.constant.Messages;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GoogleLoginCommandHandler {

    private final GoogleIdTokenVerifier googleVerifier;
    private final IUserRepository userRepository;
    private final IUserLoginRepository userLoginRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final ActivityLogHelper activityLogHelper;

    public AuthResponseDto handle(GoogleLoginCommand command) {
        String idTokenStr = command.getIdToken();

        GoogleIdToken idToken;
        try {
            idToken = googleVerifier.verify(idTokenStr);
        } catch (Exception e) {
            throw new RuntimeException("Xác thực token với Google thất bại.");
        }

        if (idToken == null) {
            throw new RuntimeException("ID Token không hợp lệ.");
        }

        Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        String name = (String) payload.get("name");

        String providerId = payload.getSubject();

        Optional<UserLogin> optionalUserLogin = userLoginRepository.findByProviderAndProviderId("google", providerId);
        User user;

        if (optionalUserLogin.isPresent()) {
            user = optionalUserLogin.get().getUser();
        } else {
            user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = new User(email, name);
                activityLogHelper.logUserRegistered(newUser.getUserId(), email);
                return userRepository.save(newUser);
            });

            UserLogin userLogin = new UserLogin(null, Messages.GOOGLE_PROVIDER, providerId, user);
            userLoginRepository.save(userLogin);
        }
        if (!user.getStatus().equalsIgnoreCase("active")) {
            throw new RuntimeException("Tài khoản của bạn đã bị vô hiệu hóa.");
        }
        String accessToken = jwtTokenProvider.generateToken(user.getUserId(), user.getRole().getRoleName());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUserId());
        refreshTokenService.save(user.getUserId(), refreshToken, 60 * 24 * 3);
        // activityLogHelper.logUserLogin(user.getUserName(), user.getUserId());
        return new AuthResponseDto(accessToken, refreshToken);
    }
}
