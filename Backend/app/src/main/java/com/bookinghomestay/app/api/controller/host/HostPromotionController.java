package com.bookinghomestay.app.api.controller.host;

import java.time.LocalDate;
import java.util.List;

import org.apache.tomcat.util.http.parser.Host;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.bookinghomestay.app.application.admin.promotion.command.UpdatePromotionCommand;
import com.bookinghomestay.app.application.admin.promotion.dto.CreatePromotionRequestDto;
import com.bookinghomestay.app.application.admin.promotion.dto.PromotionDataResponseDto;
import com.bookinghomestay.app.application.admin.promotion.dto.PromotionStatsResponseDto;
import com.bookinghomestay.app.application.admin.promotion.dto.PromotionUpdateRequestDto;
import com.bookinghomestay.app.application.admin.promotion.query.GetPromotionDataQuery;
import com.bookinghomestay.app.application.host.promotion.command.HostCreatePromotionCommandHandler;
import com.bookinghomestay.app.application.host.promotion.command.HostDeletePromotionCommandHandler;
import com.bookinghomestay.app.application.host.promotion.command.HostUpdatePromotionCommand;
import com.bookinghomestay.app.application.host.promotion.command.HostUpdatePromotionHandler;
import com.bookinghomestay.app.application.host.promotion.dto.HostCreatePromotionRequestDto;
import com.bookinghomestay.app.application.host.promotion.dto.HostPromotionDataResponseDto;
import com.bookinghomestay.app.application.host.promotion.query.HostGetPromotionQuery;
import com.bookinghomestay.app.application.host.promotion.query.HostGetPromotionQueryHandler;
import com.bookinghomestay.app.application.host.promotion.query.HostGetPromotionStatsQueryHandler;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/host/promotions")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('Admin') or hasRole('Host')")
public class HostPromotionController {
    private final HostGetPromotionQueryHandler getPromotionDataQueryHandler;
    private final HostGetPromotionStatsQueryHandler getPromotionStatsQueryHandler;
    private final HostCreatePromotionCommandHandler createPromotionCommandHandler;
    private final HostUpdatePromotionHandler updatePromotionCommandHandler;
    private final HostDeletePromotionCommandHandler deletePromotionCommandHandler;

    @GetMapping()
    public ResponseEntity<ApiResponse<PageResponse<HostPromotionDataResponseDto>>> getPromotionData(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status) {
        String userId = SecurityUtils.getCurrentUserId();
        PageResponse<HostPromotionDataResponseDto> promotions = getPromotionDataQueryHandler
                .handle(new HostGetPromotionQuery(search, page, size, status, type, startDate, endDate, userId));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy dữ liệu khuyến mãi thành công", promotions));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Void>> createPromotion(
            @RequestPart("data") HostCreatePromotionRequestDto requestDto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "homestayIds", required = false) List<String> homestayIds) {
        String userId = SecurityUtils.getCurrentUserId();
        createPromotionCommandHandler.handle(requestDto, userId, homestayIds, image);
        return ResponseEntity.ok(new ApiResponse<>(true, "Tạo khuyến mãi thành công", null));
    }

    @PostMapping("/{id}/update")
    public ResponseEntity<ApiResponse<Void>> updatePromotion(
            @PathVariable String id,
            @RequestPart("data") PromotionUpdateRequestDto updateRequestDto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "homestayIds", required = false) List<String> homestayIds) {
        String userId = SecurityUtils.getCurrentUserId();
        updatePromotionCommandHandler.handle(new HostUpdatePromotionCommand(id, updateRequestDto.getDescription(),
                image, updateRequestDto.getDiscountType(),
                updateRequestDto.getDiscountValue(), updateRequestDto.getStartDate(),
                updateRequestDto.getEndDate(), updateRequestDto.getMinBookedDays(),
                updateRequestDto.getMinNights(), updateRequestDto.getMinValue(),
                updateRequestDto.getQuantity(), updateRequestDto.getStatus(),
                updateRequestDto.getIsForNewCustomer(), homestayIds,
                userId));
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật khuyến mãi thành công", null));
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePromotion(@PathVariable String id) {
        String userId = SecurityUtils.getCurrentUserId();
        deletePromotionCommandHandler.handler(id, userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Xóa khuyến mãi thành công", null));
    }
}
