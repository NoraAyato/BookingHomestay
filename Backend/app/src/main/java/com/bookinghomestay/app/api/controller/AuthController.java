package com.bookinghomestay.app.api.controller;

import com.bookinghomestay.app.api.dto.Auth.AuthResponseDto;
import com.bookinghomestay.app.api.dto.Auth.LoginRequestDto;
import com.bookinghomestay.app.api.dto.Auth.RegisterRequestDto;
import com.bookinghomestay.app.application.command.auth.LoginUserCommand;
import com.bookinghomestay.app.application.command.auth.RegisterUserCommand;
import com.bookinghomestay.app.application.handler.LoginUserCommandHandler;
import com.bookinghomestay.app.application.handler.RegisterUserCommandHandler;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final LoginUserCommandHandler loginHandler;
    private final RegisterUserCommandHandler registerHandler;
    public AuthController(LoginUserCommandHandler loginHandler,RegisterUserCommandHandler RegHandler) {
        this.loginHandler = loginHandler;
        this.registerHandler = RegHandler;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto dto) {
        String token = loginHandler.handle(new LoginUserCommand(dto.getEmail(), dto.getPassword()));
        return ResponseEntity.ok(new AuthResponseDto(token));
    }
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody RegisterRequestDto dto) {
        String token = registerHandler.handle(new RegisterUserCommand(
            dto.getEmail(), dto.getPassWord(), dto.getFirstName(), dto.getLastName()
        ));
        return ResponseEntity.ok(new AuthResponseDto(token));
    }
}
