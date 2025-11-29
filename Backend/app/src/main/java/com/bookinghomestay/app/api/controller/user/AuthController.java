package com.bookinghomestay.app.api.controller.user;

import com.bookinghomestay.app.application.auth.command.*;
import com.bookinghomestay.app.application.auth.dto.auth.*;
import com.bookinghomestay.app.common.constant.Messages;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final LoginUserCommandHandler loginHandler;
    private final RegisterUserCommandHandler registerHandler;
    private final ChangePasswordCommandHandler changePasswordHandler;
    private final ForgotPasswordCommandHandler forgotPasswordCommandHandler;
    private final RefreshTokenCommandHandler refreshTokenCommandHandler;
    private final GoogleLoginCommandHandler googleLoginCommandHandler;
    private final ResetPasswordCommandHandler resetPasswordCommandHandler;
    private final GenerateOtpCommandHandler generateOtpCommandHandler;
    private final VerifyOtpCommandHandler verifyOtpCommandHandler;
    private final GoogleCallbackCommandHandler googleCallbackCommandHandler;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDto>> login(@Valid @RequestBody LoginRequestDto dto) {
        AuthResponseDto response = loginHandler
                .handle(new LoginUserCommand(dto.getEmail(), dto.getPassword(), dto.isRememberMe()));
        return ResponseEntity.ok(new ApiResponse<>(true, Messages.LOGIN_SUCCESS, response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponseDto>> register(@Valid @RequestBody RegisterRequestDto dto) {
        AuthResponseDto response = registerHandler.handle(new RegisterUserCommand(
                dto.getEmail(), dto.getPassWord(), dto.getFirstName(), dto.getLastName()));
        return ResponseEntity.ok(new ApiResponse<>(true, Messages.REGISTER_SUCCESS, response));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<AuthResponseDto>> changePassword(
            @Valid @RequestBody ChangePasswordRequestDto dto) {
        String userId = SecurityUtils.getCurrentUserId();
        AuthResponseDto response = changePasswordHandler.handle(new ChangePasswordCommand(
                userId, dto.getCurrentPassword(), dto.getNewPassword(), dto.getRePassword()));
        return ResponseEntity.ok(new ApiResponse<>(true, Messages.CHANGE_PASSWORD_SUCCESS, response));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDto dto) {
        forgotPasswordCommandHandler.handle(new ForgotPasswordCommand(dto.getEmail()));
        return ResponseEntity.ok(new ApiResponse<>(true, Messages.FORGOT_PASSWORD_SUCCESS, null));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponseDto>> refreshToken(@RequestBody RefreshTokenRequestDto dto) {
        AuthResponseDto response = refreshTokenCommandHandler.handle(new RefreshTokenCommand(dto.getRefreshToken()));
        return ResponseEntity.ok(new ApiResponse<>(true, Messages.REFRESH_TOKEN_SUCCESS, response));
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponseDto>> googleLogin(
            @Valid @RequestBody GoogleLoginRequestDto dto) {
        AuthResponseDto response = googleLoginCommandHandler.handle(
                new GoogleLoginCommand(dto.getIdToken()));
        return ResponseEntity.ok(new ApiResponse<>(true, Messages.GOOGLE_LOGIN_SUCCESS, response));
    }

    @GetMapping("/google/callback")
    public void googleCallback(@RequestParam("code") String code, HttpServletResponse response) throws IOException {
        AuthResponseDto authResponse = googleCallbackCommandHandler.handle(new GoogleCallbackCommand(code));
        String redirectUrl = "http://localhost:5173/auth/google-callback" + "?accessToken="
                + authResponse.getAccessToken()
                + "&refreshToken=" + authResponse.getRefreshToken();
        response.sendRedirect(redirectUrl);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequestDto dto) {
        resetPasswordCommandHandler.handle(new ResetPasswordCommand(dto.getToken(), dto.getNewPassword()));
        return ResponseEntity.ok(new ApiResponse<>(true, Messages.CHANGE_PASSWORD_SUCCESS, null));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<GenerateOtpResponseDto>> sendOtp(
            @Valid @RequestBody GenerateOtpRequestDto dto) {
        GenerateOtpResponseDto response = generateOtpCommandHandler.handle(new GenerateOtpCommand(dto.getEmail()));
        return ResponseEntity.ok(new ApiResponse<>(true, response.getMessage(), response));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(@Valid @RequestBody VerifyOtpRequestDto dto) {
        verifyOtpCommandHandler.handle(new VerifyOtpCommand(dto.getEmail(), dto.getOtp()));
        return ResponseEntity.ok(new ApiResponse<>(true, Messages.VERIFY_OTP_SUCCESS, null));
    }
}