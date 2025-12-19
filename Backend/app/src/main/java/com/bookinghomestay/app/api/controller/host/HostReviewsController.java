package com.bookinghomestay.app.api.controller.host;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.application.admin.reviews.dto.ReviewsDataResponseDto;
import com.bookinghomestay.app.application.admin.reviews.dto.ReviewsStatsResponseDto;
import com.bookinghomestay.app.application.admin.reviews.query.GetReviewsDataQuery;
import com.bookinghomestay.app.application.host.reviews.query.GetHostReviewsDataQuery;
import com.bookinghomestay.app.application.host.reviews.query.GetHostReviewsDataQueryHandler;
import com.bookinghomestay.app.application.host.reviews.query.GetHostReviewsStatsHandler;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/host/reviews")
@RequiredArgsConstructor
@Slf4j
public class HostReviewsController {
    private final GetHostReviewsStatsHandler getHostReviewsStatsHandler;
    private final GetHostReviewsDataQueryHandler getHostReviewsDataQueryHandler;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<ReviewsStatsResponseDto>> getReviewsStats() {
        String userId = SecurityUtils.getCurrentUserId();
        ReviewsStatsResponseDto stats = getHostReviewsStatsHandler.handle(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thống kê đánh giá thành công", stats));
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<PageResponse<ReviewsDataResponseDto>>> getReviewsData(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) String homestayId) {
        PageResponse<ReviewsDataResponseDto> query = getHostReviewsDataQueryHandler
                .handle(new GetHostReviewsDataQuery(page, size, rating, search, homestayId, startDate, endDate,
                        SecurityUtils.getCurrentUserId()));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy dữ liệu đánh giá thành công", query));
    }
}
