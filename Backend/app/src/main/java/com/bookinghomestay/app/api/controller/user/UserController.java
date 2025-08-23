package com.bookinghomestay.app.api.controller.user;

import com.bookinghomestay.app.api.dto.ApiResponse;
import com.bookinghomestay.app.api.dto.users.CreateUserRequestDto;
import com.bookinghomestay.app.api.dto.users.UpdateProfileRequestDto;
import com.bookinghomestay.app.api.dto.users.UserInfoDto;
import com.bookinghomestay.app.api.dto.users.UserResponseDto;
import com.bookinghomestay.app.application.users.command.CreateUserCommand;
import com.bookinghomestay.app.application.users.command.CreateUserCommandHandler;
import com.bookinghomestay.app.application.users.command.UpdateUserProfileCommand;
import com.bookinghomestay.app.application.users.command.UpdateUserProfileCommandHandler;
import com.bookinghomestay.app.application.users.command.UploadUserImgCommandHandler;
import com.bookinghomestay.app.application.users.command.UploadUserPictureCommand;
import com.bookinghomestay.app.application.users.query.GetCurrentUserQueryHandler;
import com.bookinghomestay.app.application.users.query.GetUserByIdQuery;
import com.bookinghomestay.app.application.users.query.GetUserByIdQueryHandler;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class UserController {
    private final GetUserByIdQueryHandler getUserByIdQueryHandler;
    private final CreateUserCommandHandler createUserCommandHandler;
    private final GetCurrentUserQueryHandler getCurrentUserQueryHandler;
    private final UpdateUserProfileCommandHandler updateUserProfileCommandHandler;
    private final UploadUserImgCommandHandler uploadUserImgCommandHandler;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDto>> getById(@PathVariable String id) {
        User user = getUserByIdQueryHandler.handle(new GetUserByIdQuery(id));
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Lấy thông tin người dùng thành công", new UserResponseDto(user)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createUser(@Valid @RequestBody CreateUserRequestDto dto) {
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
        return ResponseEntity.ok(new ApiResponse<>(true, "Tạo người dùng thành công", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserInfoDto>> getCurrentUser() {
        UserInfoDto user = getCurrentUserQueryHandler.handle();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin người dùng thành công", user));
    }

    @PutMapping("/me/update-profile")
    public ResponseEntity<ApiResponse<Void>> updateProfile(@Valid @RequestBody UpdateProfileRequestDto dto) {
        String userId = SecurityUtils.getCurrentUserId();

        updateUserProfileCommandHandler.handle(new UpdateUserProfileCommand(
                userId,
                dto.getUserName(),
                dto.getPhoneNumber(),
                dto.isGender(),
                dto.getBirthdayAsDate()));
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật thông tin người dùng thành công !", null));
    }

    @PutMapping("/me/update-picture")
    public ResponseEntity<ApiResponse<Void>> updatePicture(@RequestParam("file") MultipartFile file) {
        String userId = SecurityUtils.getCurrentUserId();
        uploadUserImgCommandHandler.handle(new UploadUserPictureCommand(userId, file));
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật ảnh đại diện thành công!", null));
    }

}