package com.bookinghomestay.app.api.controller.user;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.application.promotion.dto.AvailablePromotionResponseDto;
import com.bookinghomestay.app.application.promotion.query.GetAvailablePromotionQuery;
import com.bookinghomestay.app.application.promotion.query.GetAvailablePromotionQueryHandler;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {

        private final GetAvailablePromotionQueryHandler getAvailablePromotionQueryHandler;

        @GetMapping("/available-promotions")
        public ResponseEntity<ApiResponse<List<AvailablePromotionResponseDto>>> getUserPromotions(
                        @RequestParam(required = false) String maPDPhong) {
                String userId = SecurityUtils.getCurrentUserId();

                GetAvailablePromotionQuery query = new GetAvailablePromotionQuery(
                                maPDPhong,
                                userId);

                List<AvailablePromotionResponseDto> promotions = getAvailablePromotionQueryHandler.handle(query);

                return ResponseEntity.ok(new ApiResponse<>(
                                true,
                                "Lấy danh sách khuyến mãi khả dụng",
                                promotions));
        }
}