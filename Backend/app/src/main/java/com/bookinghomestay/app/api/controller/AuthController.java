package com.bookinghomestay.app.api.controller;

import com.bookinghomestay.app.api.dto.ApiResponse;
import com.bookinghomestay.app.api.dto.Auth.*;
import com.bookinghomestay.app.application.auth.command.*;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final LoginUserCommandHandler loginHandler;
    private final RegisterUserCommandHandler registerHandler;
    private final ChangePasswordCommandHandler changePasswordHandler;
    private final ForgotPasswordCommandHandler forgotPasswordCommandHandler;
    private final VerifyOtpCommandHandler verifyOtpCommandHandler;

    public AuthController(LoginUserCommandHandler loginHandler,
            RegisterUserCommandHandler registerHandler,
            ChangePasswordCommandHandler changePasswordHandler,
            ForgotPasswordCommandHandler forgotPasswordCommandHandler,
            VerifyOtpCommandHandler verifyOtpCommandHandler) {
        this.loginHandler = loginHandler;
        this.registerHandler = registerHandler;
        this.changePasswordHandler = changePasswordHandler;
        this.forgotPasswordCommandHandler = forgotPasswordCommandHandler;
        this.verifyOtpCommandHandler = verifyOtpCommandHandler;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDto>> login(@Valid @RequestBody LoginRequestDto dto) {
        String token = loginHandler.handle(new LoginUserCommand(dto.getEmail(), dto.getPassword()));
        return ResponseEntity.ok(new ApiResponse<>(true, "Đăng nhập thành công", new AuthResponseDto(token)));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponseDto>> register(@Valid @RequestBody RegisterRequestDto dto) {
        String token = registerHandler.handle(new RegisterUserCommand(
                dto.getEmail(), dto.getPassWord(), dto.getFirstName(), dto.getLastName()));
        return ResponseEntity.ok(new ApiResponse<>(true, "Đăng ký thành công", new AuthResponseDto(token)));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<AuthResponseDto>> changePassword(
            @Valid @RequestBody ChangePasswordRequestDto dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String token = changePasswordHandler.handle(new ChangePasswordCommand(
                email, dto.getCurrentPassword(), dto.getNewPassword(), dto.getRePassword()));
        return ResponseEntity.ok(new ApiResponse<>(true, "Thay đổi mật khẩu thành công", new AuthResponseDto(token)));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDto dto) {
        String message = forgotPasswordCommandHandler.handle(new ForgotPasswordCommand(dto.getEmail()));
        return ResponseEntity.ok(new ApiResponse<>(true, message, null));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(@RequestBody VerifyOtpRequestDto dto) {
        verifyOtpCommandHandler.handle(new VerifyOtpCommand(dto.getEmail(), dto.getOtp()));
        return ResponseEntity.ok(new ApiResponse<>(true, "Xác thực OTP thành công", null));
    }
}
