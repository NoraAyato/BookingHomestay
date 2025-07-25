package com.bookinghomestay.app.api.controller.auth;

import com.bookinghomestay.app.api.constant.Messages;
import com.bookinghomestay.app.api.dto.ApiResponse;
import com.bookinghomestay.app.api.dto.Auth.*;
import com.bookinghomestay.app.application.auth.command.*;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final LoginUserCommandHandler loginHandler;
    private final RegisterUserCommandHandler registerHandler;
    private final ChangePasswordCommandHandler changePasswordHandler;
    private final ForgotPasswordCommandHandler forgotPasswordCommandHandler;
    private final VerifyOtpCommandHandler verifyOtpCommandHandler;
    private final RefreshTokenCommandHandler refreshTokenCommandHandler;
    private final GoogleLoginCommandHandler googleLoginCommandHandler;
    private final ResetPasswordCommandHandler resetPasswordCommandHandler;

    public AuthController(LoginUserCommandHandler loginHandler,
            RegisterUserCommandHandler registerHandler,
            ChangePasswordCommandHandler changePasswordHandler,
            ForgotPasswordCommandHandler forgotPasswordCommandHandler,
            VerifyOtpCommandHandler verifyOtpCommandHandler,
            RefreshTokenCommandHandler refreshTokenCommandHandler,
            GoogleLoginCommandHandler googleLoginCommandHandler,
            ResetPasswordCommandHandler resetPasswordCommandHandler) {
        this.loginHandler = loginHandler;
        this.registerHandler = registerHandler;
        this.changePasswordHandler = changePasswordHandler;
        this.forgotPasswordCommandHandler = forgotPasswordCommandHandler;
        this.verifyOtpCommandHandler = verifyOtpCommandHandler;
        this.refreshTokenCommandHandler = refreshTokenCommandHandler;
        this.googleLoginCommandHandler = googleLoginCommandHandler;
        this.resetPasswordCommandHandler = resetPasswordCommandHandler;
    }

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
        String email = SecurityUtils.getCurrentUsername();
        AuthResponseDto response = changePasswordHandler.handle(new ChangePasswordCommand(
                email, dto.getCurrentPassword(), dto.getNewPassword(), dto.getRePassword()));
        return ResponseEntity.ok(new ApiResponse<>(true, Messages.CHANGE_PASSWORD_SUCCESS, response));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDto dto) {
        String message = forgotPasswordCommandHandler.handle(new ForgotPasswordCommand(dto.getEmail()));
        return ResponseEntity.ok(new ApiResponse<>(true, message, null));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<AuthResponseDto>> verifyOtp(@RequestBody VerifyOtpRequestDto dto) {
        AuthResponseDto respone = verifyOtpCommandHandler.handle(new VerifyOtpCommand(dto.getEmail(), dto.getOtp()));
        return ResponseEntity.ok(new ApiResponse<>(true, Messages.VERIFY_OTP_SUCCESS, respone));
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

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequestDto dto) {
        resetPasswordCommandHandler.handle(new ResetPasswordCommand(dto.getToken(), dto.getNewPassword()));
        return ResponseEntity.ok(new ApiResponse<>(true, Messages.CHANGE_PASSWORD_SUCCESS, null));
    }
}
