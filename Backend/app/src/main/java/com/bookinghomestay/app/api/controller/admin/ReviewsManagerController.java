package com.bookinghomestay.app.api.controller.admin;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.application.admin.reviews.command.ApproveReviewCommandHandler;
import com.bookinghomestay.app.application.admin.reviews.command.DeleteReviewCommandHandler;
import com.bookinghomestay.app.application.admin.reviews.dto.ReviewsDataResponseDto;
import com.bookinghomestay.app.application.admin.reviews.dto.ReviewsStatsResponseDto;
import com.bookinghomestay.app.application.admin.reviews.query.GetReviewsDataQuery;
import com.bookinghomestay.app.application.admin.reviews.query.GetReviewsDataQueryHandler;
import com.bookinghomestay.app.application.admin.reviews.query.GetReviewsStatsQueryHandler;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.common.response.PageResponse;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/admin/reviewsmanager")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('Admin')")
public class ReviewsManagerController {
    private final GetReviewsDataQueryHandler getReviewsDataQueryHandler;
    private final DeleteReviewCommandHandler deleteReviewCommandHandler;
    private final GetReviewsStatsQueryHandler getReviewsStatsQueryHandler;
    private final ApproveReviewCommandHandler approveReviewCommandHandler;

    @GetMapping()
    public ResponseEntity<ApiResponse<PageResponse<ReviewsDataResponseDto>>> getReviewsData(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) Integer rating, @RequestParam(required = false) Boolean status) {
        PageResponse<ReviewsDataResponseDto> query = getReviewsDataQueryHandler
                .handle(new GetReviewsDataQuery(page, size, rating, search, startDate, endDate, status));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy dữ liệu đánh giá thành công", query));
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable String id) {
        deleteReviewCommandHandler.handle(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Xóa đánh giá thành công !", null));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<ApiResponse<Void>> approveReview(@PathVariable String id) {
        approveReviewCommandHandler.handle(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Duyệt đánh giá thành công !", null));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<ReviewsStatsResponseDto>> getReviewsStats() {
        ReviewsStatsResponseDto stats = getReviewsStatsQueryHandler.handle();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thống kê đánh giá thành công", stats));
    }
}
