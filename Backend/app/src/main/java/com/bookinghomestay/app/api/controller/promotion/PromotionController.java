package com.bookinghomestay.app.api.controller.promotion;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.api.dto.ApiResponse;
import com.bookinghomestay.app.api.dto.promotion.PromotionResponeDto;
import com.bookinghomestay.app.application.promotion.query.GetAdminKhuyenMaiQueryHandle;
import com.bookinghomestay.app.application.promotion.query.GetKhuyenMaiQueryHandler;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final GetAdminKhuyenMaiQueryHandle getAdminKhuyenMaiQueryHandle;
    private final GetKhuyenMaiQueryHandler getKhuyenMaiQueryHandler;

    @GetMapping()
    public ResponseEntity<ApiResponse<List<PromotionResponeDto>>> getAdminKhuyenMai() {
        try {
            List<PromotionResponeDto> khuyenMais = getAdminKhuyenMaiQueryHandle.handle();
            ApiResponse<List<PromotionResponeDto>> response = new ApiResponse<>(
                    true,
                    "Lấy danh sách khuyến mãi admin thành công",
                    khuyenMais);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<List<PromotionResponeDto>> response = new ApiResponse<>(
                    false,
                    "Lỗi khi lấy danh sách khuyến mãi: " + e.getMessage(),
                    null);
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{kmId}")
    public ResponseEntity<ApiResponse<PromotionResponeDto>> getKhuyenMaiById(@PathVariable String kmId) {
        try {
            PromotionResponeDto khuyenMai = getKhuyenMaiQueryHandler.handle(kmId);
            ApiResponse<PromotionResponeDto> response = new ApiResponse<>(
                    true,
                    "Lấy khuyến mãi thành công",
                    khuyenMai);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<PromotionResponeDto> response = new ApiResponse<>(
                    false,
                    "Lỗi khi lấy khuyến mãi: " + e.getMessage(),
                    null);
            return ResponseEntity.status(404).body(response);
        }
    }
}