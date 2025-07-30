package com.bookinghomestay.app.api.controller.promotion;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.api.dto.ApiResponse;
import com.bookinghomestay.app.api.dto.promotion.PromotionResponeDto;
import com.bookinghomestay.app.application.promotion.query.GetAdminKhuyenMaiQueryHandle;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private GetAdminKhuyenMaiQueryHandle getAdminKhuyenMaiQueryHandle;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PromotionResponeDto>>> getAdminKhuyenMai() {
        List<PromotionResponeDto> khuyenMais = getAdminKhuyenMaiQueryHandle.handle();
        ApiResponse<List<PromotionResponeDto>> response = new ApiResponse<>(
                true,
                "Lấy danh sách khuyến mãi thành công",
                khuyenMais);
        return ResponseEntity.ok(response);
    }
}