package com.bookinghomestay.app.api.controller.promotion;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.api.dto.common.ApiResponse;
import com.bookinghomestay.app.api.dto.promotion.AvailablePromotionResponseDto;
import com.bookinghomestay.app.api.dto.promotion.GetMyPromotionRequestDto;
import com.bookinghomestay.app.api.dto.promotion.PromotionResponeDto;
import com.bookinghomestay.app.application.promotion.query.GetAdminKhuyenMaiQueryHandle;
import com.bookinghomestay.app.application.promotion.query.GetKhuyenMaiQueryHandler;
import com.bookinghomestay.app.application.promotion.query.GetMyPromotionQuery;
import com.bookinghomestay.app.application.promotion.query.GetMyPromotionQueryHandler;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {

        private final GetAdminKhuyenMaiQueryHandle getAdminKhuyenMaiQueryHandle;
        private final GetKhuyenMaiQueryHandler getKhuyenMaiQueryHandler;
        private final GetMyPromotionQueryHandler getMyPromotionQueryHandler;

        @GetMapping()
        public ResponseEntity<ApiResponse<List<PromotionResponeDto>>> getAllPromotions() {
                List<PromotionResponeDto> promotions = getAdminKhuyenMaiQueryHandle.handle();
                return ResponseEntity.ok(new ApiResponse<>(
                                true,
                                "Lấy danh sách khuyến mãi thành công",
                                promotions));
        }

        @GetMapping("/{promotionId}")
        public ResponseEntity<ApiResponse<PromotionResponeDto>> getPromotionById(@PathVariable String promotionId) {
                PromotionResponeDto promotion = getKhuyenMaiQueryHandler.handle(promotionId);
                return ResponseEntity.ok(new ApiResponse<>(
                                true,
                                "Lấy khuyến mãi thành công",
                                promotion));
        }

        @GetMapping("/available-promotions")
        public ResponseEntity<ApiResponse<List<AvailablePromotionResponseDto>>> getUserPromotions(
                        @Valid @RequestParam GetMyPromotionRequestDto request) {
                String userId = SecurityUtils.getCurrentUserId();

                GetMyPromotionQuery query = new GetMyPromotionQuery(
                                request.getMaPDPhong(),
                                request.getNgayDen(),
                                request.getNgayDi(),
                                userId);

                List<AvailablePromotionResponseDto> promotions = getMyPromotionQueryHandler.handle(query);

                return ResponseEntity.ok(new ApiResponse<>(
                                true,
                                "Lấy danh sách khuyến mãi khả dụng",
                                promotions));
        }
}