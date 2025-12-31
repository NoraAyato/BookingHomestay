package com.bookinghomestay.app.api.controller.user;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.application.reviews.dto.TopReviewResponseDto;
import com.bookinghomestay.app.application.reviews.query.GetTopReviewQueryHandler;
import com.bookinghomestay.app.common.response.ApiResponse;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewsController {
    private final GetTopReviewQueryHandler getTopReviewQueryHandler;

    @GetMapping("/top")
    public ResponseEntity<ApiResponse<List<TopReviewResponseDto>>> getTopReviews() {
        List<TopReviewResponseDto> topReviews = getTopReviewQueryHandler.handle();
        return ResponseEntity.ok(new ApiResponse<List<TopReviewResponseDto>>(true, "Lấy top reviews thành công !",
                topReviews));
    }

}
