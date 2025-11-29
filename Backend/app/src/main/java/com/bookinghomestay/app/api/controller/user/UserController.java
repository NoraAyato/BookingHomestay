package com.bookinghomestay.app.api.controller.user;

import com.bookinghomestay.app.application.booking.dto.booking.BookingResponseDto;
import com.bookinghomestay.app.application.booking.query.GetBookingListQuery;
import com.bookinghomestay.app.application.booking.query.GetMyBookingListQueryHandler;
import com.bookinghomestay.app.application.danhgia.command.PostReviewCommandHandler;
import com.bookinghomestay.app.application.danhgia.dto.ReviewAddCommandDto;
import com.bookinghomestay.app.application.danhgia.dto.ReviewAddRequestDto;
import com.bookinghomestay.app.application.users.command.AddFavoriteHomestayCommand;
import com.bookinghomestay.app.application.users.command.AddFavoriteHomestayCommandHandler;
import com.bookinghomestay.app.application.users.command.UpdateRecieveEmailCommand;
import com.bookinghomestay.app.application.users.command.UpdateUserProfileCommand;
import com.bookinghomestay.app.application.users.command.UpdateUserProfileCommandHandler;
import com.bookinghomestay.app.application.users.command.UpdateUserRecieveEmailHandler;
import com.bookinghomestay.app.application.users.command.UploadUserImgCommandHandler;
import com.bookinghomestay.app.application.users.command.UploadUserPictureCommand;
import com.bookinghomestay.app.application.users.dto.UpdateProfileRequestDto;
import com.bookinghomestay.app.application.users.dto.UserFavoriteHomestayResponseDto;
import com.bookinghomestay.app.application.users.dto.UserInfoResponeDto;
import com.bookinghomestay.app.application.users.query.GetCurrentUserQueryHandler;
import com.bookinghomestay.app.application.users.query.GetFavoriteHomestayQuery;
import com.bookinghomestay.app.application.users.query.GetUserFavoriteHomestayQueryHandler;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.common.response.PageResponse;
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
    private final GetCurrentUserQueryHandler getCurrentUserQueryHandler;
    private final UpdateUserProfileCommandHandler updateUserProfileCommandHandler;
    private final UploadUserImgCommandHandler uploadUserImgCommandHandler;
    private final GetMyBookingListQueryHandler getBookingListQueryHandler;
    private final UpdateUserRecieveEmailHandler updateUserRecieveEmailHandler;
    private final GetUserFavoriteHomestayQueryHandler getUserFavoriteHomestayQueryHandler;
    private final AddFavoriteHomestayCommandHandler addFavoriteHomestayCommandHandler;
    private final PostReviewCommandHandler postReviewCommandHandler;

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
    public ResponseEntity<ApiResponse<PageResponse<BookingResponseDto>>> getMyBookings(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        String userId = SecurityUtils.getCurrentUserId();
        PageResponse<BookingResponseDto> pageResponse = getBookingListQueryHandler
                .handle(new GetBookingListQuery(userId, page, limit));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách đặt phòng thành công !", pageResponse));
    }

    @PutMapping("/me/update-picture")
    public ResponseEntity<ApiResponse<Void>> updatePicture(@RequestParam("file") MultipartFile file) {
        String userId = SecurityUtils.getCurrentUserId();
        uploadUserImgCommandHandler.handle(new UploadUserPictureCommand(userId, file));
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật ảnh đại diện thành công !", null));
    }

    @PostMapping("/me/add-favorite-homestay")
    public ResponseEntity<ApiResponse<Void>> addFavorite(@RequestParam String homestayId) {
        String userId = SecurityUtils.getCurrentUserId();
        String result = addFavoriteHomestayCommandHandler.handle(new AddFavoriteHomestayCommand(userId, homestayId));
        return ResponseEntity.ok(new ApiResponse<>(true, result, null));
    }

    @GetMapping("/me/my-favorites")
    public ResponseEntity<ApiResponse<PageResponse<UserFavoriteHomestayResponseDto>>> getMyFavorites(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "4") int limit) {
        String userId = SecurityUtils.getCurrentUserId();
        PageResponse<UserFavoriteHomestayResponseDto> entity = getUserFavoriteHomestayQueryHandler
                .handle(new GetFavoriteHomestayQuery(userId, page, limit));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách yêu thích thành công !", entity));
    }

    @PostMapping("/me/add-review")
    public ResponseEntity<?> addReview(
            @RequestParam String bookingId,
            @RequestParam String homestayId,
            @RequestParam Integer cleanlinessRating,
            @RequestParam Integer serviceRating,
            @RequestParam Integer utilitiesRating,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam String comment) {
        String userId = SecurityUtils.getCurrentUserId();

        postReviewCommandHandler
                .handle(new ReviewAddCommandDto(userId, bookingId, homestayId,
                        cleanlinessRating, utilitiesRating, serviceRating, image,
                        comment));
        return ResponseEntity.ok(new ApiResponse<>(true, "Thêm đánh giá thành công !", null));
    }

}