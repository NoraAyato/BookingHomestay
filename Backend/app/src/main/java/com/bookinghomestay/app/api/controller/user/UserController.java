package com.bookinghomestay.app.api.controller.user;

import com.bookinghomestay.app.api.dto.ApiResponse;
import com.bookinghomestay.app.api.dto.Users.CreateUserRequestDto;
import com.bookinghomestay.app.api.dto.Users.UserInfoDto;
import com.bookinghomestay.app.api.dto.Users.UserResponseDto;
import com.bookinghomestay.app.application.users.command.CreateUserCommand;
import com.bookinghomestay.app.application.users.command.CreateUserCommandHandler;
import com.bookinghomestay.app.application.users.query.GetCurrentUserQueryHandler;
import com.bookinghomestay.app.application.users.query.GetUserByIdQuery;
import com.bookinghomestay.app.application.users.query.GetUserByIdQueryHandler;
import com.bookinghomestay.app.domain.model.User;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final GetUserByIdQueryHandler getUserByIdQueryHandler;
    private final CreateUserCommandHandler createUserCommandHandler;
    private final GetCurrentUserQueryHandler getCurrentUserQueryHandler;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getById(@PathVariable String id) {
        User user = getUserByIdQueryHandler.handle(new GetUserByIdQuery(id));
        return ResponseEntity.ok(new UserResponseDto(user));
    }

    @PostMapping
    public ResponseEntity<String> createUser(@Valid @RequestBody CreateUserRequestDto dto) {
        CreateUserCommand command = new CreateUserCommand(
                dto.getUserName(),
                dto.getPassWord(),
                dto.getFirstName(),
                dto.getLastName(),
                dto.getEmail(),
                dto.getPicture(),
                dto.getPhoneNumber(),
                dto.getIsRecieveEmail(),
                dto.isGender(),
                dto.getBirthday(),
                dto.getRoleId());

        createUserCommandHandler.handle(command);
        return ResponseEntity.ok("User created successfully");
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserInfoDto>> getCurrentUser() {
        UserInfoDto user = getCurrentUserQueryHandler.handle();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin người dùng thành công", user));
    }
}