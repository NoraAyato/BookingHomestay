package com.bookinghomestay.app.api.controller.user;

import com.bookinghomestay.app.api.dto.booking.MyBookingListResponseDto;
import com.bookinghomestay.app.api.dto.common.ApiResponse;
import com.bookinghomestay.app.api.dto.common.PageResponse;
import com.bookinghomestay.app.api.dto.users.UpdateProfileRequestDto;
import com.bookinghomestay.app.api.dto.users.UserInfoResponeDto;
import com.bookinghomestay.app.application.booking.query.GetBookingListQuery;
import com.bookinghomestay.app.application.booking.query.GetMyBookingListQueryHandler;
import com.bookinghomestay.app.application.users.command.UpdateRecieveEmailCommand;
import com.bookinghomestay.app.application.users.command.UpdateUserProfileCommand;
import com.bookinghomestay.app.application.users.command.UpdateUserProfileCommandHandler;
import com.bookinghomestay.app.application.users.command.UpdateUserRecieveEmailHandler;
import com.bookinghomestay.app.application.users.command.UploadUserImgCommandHandler;
import com.bookinghomestay.app.application.users.command.UploadUserPictureCommand;
import com.bookinghomestay.app.application.users.query.GetCurrentUserQueryHandler;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class UserController {
    private final GetCurrentUserQueryHandler getCurrentUserQueryHandler;
    private final UpdateUserProfileCommandHandler updateUserProfileCommandHandler;
    private final UploadUserImgCommandHandler uploadUserImgCommandHandler;
    private final GetMyBookingListQueryHandler getBookingListQueryHandler;
    private final UpdateUserRecieveEmailHandler updateUserRecieveEmailHandler;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserInfoResponeDto>> getCurrentUser() {
        UserInfoResponeDto user = getCurrentUserQueryHandler.handle();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin người dùng thành công !", user));
    }

    @PutMapping("/me/receive-email/{isRecieveEmail}")
    public ResponseEntity<ApiResponse<Void>> updateUserRecieveEmail(@PathVariable boolean isRecieveEmail) {
        String userId = SecurityUtils.getCurrentUserId();
        updateUserRecieveEmailHandler.handle(new UpdateRecieveEmailCommand(userId, isRecieveEmail));
        return ResponseEntity.ok(new ApiResponse<>(true, "Đăng kí nhận ưu đãi thành công !", null));
    }

    @PutMapping("/me/update-profile")
    public ResponseEntity<ApiResponse<Void>> updateProfile(@Valid @RequestBody UpdateProfileRequestDto dto) {
        String userId = SecurityUtils.getCurrentUserId();

        updateUserProfileCommandHandler.handle(new UpdateUserProfileCommand(
                userId,
                dto.getFirstName(),
                dto.getLastName(),
                dto.getPhoneNumber(),
                dto.isGender(),
                dto.getBirthdayAsDate()));
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật thông tin người dùng thành công !", null));
    }

    @GetMapping("/me/my-bookings")
    public ResponseEntity<ApiResponse<PageResponse<MyBookingListResponseDto>>> getMyBookings(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        String userId = SecurityUtils.getCurrentUserId();
        PageResponse<MyBookingListResponseDto> pageResponse = getBookingListQueryHandler
                .handle(new GetBookingListQuery(userId, page, limit));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách đặt phòng thành công !", pageResponse));
    }

    @PutMapping("/me/update-picture")
    public ResponseEntity<ApiResponse<Void>> updatePicture(@RequestParam("file") MultipartFile file) {
        String userId = SecurityUtils.getCurrentUserId();
        uploadUserImgCommandHandler.handle(new UploadUserPictureCommand(userId, file));
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật ảnh đại diện thành công !", null));
    }
}