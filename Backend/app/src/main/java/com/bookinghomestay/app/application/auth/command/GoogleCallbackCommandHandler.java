package com.bookinghomestay.app.application.auth.command;

import com.bookinghomestay.app.api.constant.Messages;
import com.bookinghomestay.app.api.dto.Auth.AuthResponseDto;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.model.UserLogin;
import com.bookinghomestay.app.domain.repository.IUserLoginRepository;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.RefreshTokenService;
import com.bookinghomestay.app.infrastructure.security.JwtTokenProvider;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import org.springframework.beans.factory.annotation.Value;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@Service
@RequiredArgsConstructor
public class GoogleCallbackCommandHandler {

    private final IUserRepository userRepository;
    private final IUserLoginRepository userLoginRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final GoogleIdTokenVerifier googleVerifier;

    @Value("${google.oauth.client-id}")
    private String clientId;

    @Value("${google.oauth.client-secret}")
    private String clientSecret;

    @Value("${google.oauth.redirect-uri}")
    private String redirectUri;

    public AuthResponseDto handle(GoogleCallbackCommand command) {
        String code = command.getCode();
        // Exchange code for tokens
        RestTemplate restTemplate = new RestTemplate();
        String tokenUrl = "https://oauth2.googleapis.com/token";
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri);
        params.add("grant_type", "authorization_code");
        System.out.println("code: " + code);
        System.out.println("client_id: " + clientId);
        System.out.println("client_secret: " + clientSecret);
        System.out.println("redirect_uri: " + redirectUri);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);
        String idTokenStr = (String) response.getBody().get("id_token");

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
        String picture = (String) payload.get("picture");
        String providerId = payload.getSubject();

        Optional<UserLogin> optionalUserLogin = userLoginRepository.findByProviderAndProviderId("google", providerId);
        User user;

        if (optionalUserLogin.isPresent()) {
            user = optionalUserLogin.get().getUser();
        } else {
            user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = new User(email, name);
                newUser.setPicture(picture);
                return userRepository.save(newUser);
            });

            UserLogin userLogin = new UserLogin(null, Messages.GOOGLE_PROVIDER, providerId, user);
            userLoginRepository.save(userLogin);
        }

        String accessToken = jwtTokenProvider.generateToken(user.getUserId(), user.getRole().getRoleName());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUserId());
        refreshTokenService.save(user.getUserId(), refreshToken, 60 * 24 * 3);

        return new AuthResponseDto(accessToken, refreshToken);
    }
}