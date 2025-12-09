package com.bookinghomestay.app.api.controller.admin;

import java.time.LocalDate;

import org.apache.catalina.security.SecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.bookinghomestay.app.application.admin.promotion.command.CreatePromotionCommand;
import com.bookinghomestay.app.application.admin.promotion.command.CreatePromotionCommandHandler;
import com.bookinghomestay.app.application.admin.promotion.command.DeletePromotionCommandHandler;
import com.bookinghomestay.app.application.admin.promotion.command.UpdatePromotionCommand;
import com.bookinghomestay.app.application.admin.promotion.command.UpdatePromotionCommandHandler;
import com.bookinghomestay.app.application.admin.promotion.dto.CreatePromotionRequestDto;
import com.bookinghomestay.app.application.admin.promotion.dto.PromotionDataResponseDto;
import com.bookinghomestay.app.application.admin.promotion.dto.PromotionStatsResponseDto;
import com.bookinghomestay.app.application.admin.promotion.dto.PromotionUpdateRequestDto;
import com.bookinghomestay.app.application.admin.promotion.query.GetPromotionDataQuery;
import com.bookinghomestay.app.application.admin.promotion.query.GetPromotionDataQueryHandler;
import com.bookinghomestay.app.application.admin.promotion.query.GetPromotionStatsQueryHandler;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;
import com.google.api.services.storage.Storage.BucketAccessControls.Delete;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/admin/promotionmanager")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('Admin')")
public class PromotionMangerController {
        private final GetPromotionStatsQueryHandler getPromotionStatsQueryHandler;
        private final GetPromotionDataQueryHandler getPromotionDataQueryHandler;
        private final UpdatePromotionCommandHandler updatePromotionCommandHandler;
        private final CreatePromotionCommandHandler createPromotionCommandHandler;
        private final DeletePromotionCommandHandler deletePromotionCommandHandler;

        @GetMapping("/stats")
        public ResponseEntity<ApiResponse<PromotionStatsResponseDto>> getPromotionStats() {
                PromotionStatsResponseDto stats = getPromotionStatsQueryHandler.handle();
                return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thống kê khuyến mãi thành công",
                                stats));
        }

        @GetMapping()
        public ResponseEntity<ApiResponse<PageResponse<PromotionDataResponseDto>>> getPromotionData(
                        @RequestParam(required = false) String search,
                        @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "5") int size,
                        @RequestParam(required = false) LocalDate startDate,
                        @RequestParam(required = false) LocalDate endDate,
                        @RequestParam(required = false) String status) {
                PageResponse<PromotionDataResponseDto> promotions = getPromotionDataQueryHandler
                                .handler(new GetPromotionDataQuery(
                                                startDate, endDate, search, status, page, size));
                return ResponseEntity.ok(new ApiResponse<>(true, "Lấy dữ liệu khuyến mãi thành công", promotions));
        }

        @PostMapping("/create")
        public ResponseEntity<ApiResponse<Void>> createPromotion(
                        @RequestPart("data") CreatePromotionRequestDto requestDto,
                        @RequestPart(value = "image", required = false) MultipartFile image) {
                String userId = SecurityUtils.getCurrentUserId();
                createPromotionCommandHandler.handler(requestDto, image, userId);
                return ResponseEntity.ok(new ApiResponse<>(true, "Tạo khuyến mãi thành công", null));
        }

        @PostMapping("/{id}/update")
        public ResponseEntity<ApiResponse<Void>> updatePromotion(
                        @PathVariable String id,
                        @RequestPart("data") PromotionUpdateRequestDto updateRequestDto,
                        @RequestPart(value = "image", required = false) MultipartFile image) {

                updatePromotionCommandHandler.handle(new UpdatePromotionCommand(id, updateRequestDto.getDescription(),
                                image, updateRequestDto.getDiscountType(),
                                updateRequestDto.getDiscountValue(), updateRequestDto.getStartDate(),
                                updateRequestDto.getEndDate(), updateRequestDto.getMinBookedDays(),
                                updateRequestDto.getMinNights(), updateRequestDto.getMinValue(),
                                updateRequestDto.getQuantity(), updateRequestDto.getStatus(),
                                updateRequestDto.getIsForNewCustomer()));

                return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật khuyến mãi thành công", null));
        }

        @PostMapping("/delete/{id}")
        public ResponseEntity<ApiResponse<Void>> deletePromotion(@PathVariable String id) {
                deletePromotionCommandHandler.handler(id);
                return ResponseEntity.ok(new ApiResponse<>(true, "Xóa khuyến mãi thành công", null));
        }
}
