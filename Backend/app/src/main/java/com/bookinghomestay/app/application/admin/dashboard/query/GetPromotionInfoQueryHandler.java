package com.bookinghomestay.app.application.admin.dashboard.query;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.dashboard.dto.DashboardPromotionDto;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetPromotionInfoQueryHandler {
    private final IKhuyenMaiRepository khuyenMaiRepository;

    public List<DashboardPromotionDto> handle() {
        var promotionInfo = khuyenMaiRepository.getAdminKm(10);
        List<DashboardPromotionDto> result = promotionInfo.stream()
                .map(promotion -> DashboardPromotionDto.builder()
                        .id(promotion.getMaKM())
                        .name(promotion.getNoiDung())
                        .status(promotion.getTrangThai())
                        .used(promotion.getHoaDons() != null ? String.valueOf(promotion.getHoaDons().size()) : "0")
                        .total(promotion.getSoLuong().toBigInteger() != null
                                ? promotion.getSoLuong().toBigInteger().toString()
                                : "0")
                        .build())
                .toList();
        return result;
    }
}
