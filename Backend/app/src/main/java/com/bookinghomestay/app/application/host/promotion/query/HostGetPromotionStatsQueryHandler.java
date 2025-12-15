package com.bookinghomestay.app.application.host.promotion.query;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.promotion.dto.PromotionStatsResponseDto;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HostGetPromotionStatsQueryHandler {
    private final IKhuyenMaiRepository promotionRepository;

    public PromotionStatsResponseDto handle() {
        int total = promotionRepository.getAll().size();
        int active = (int) promotionRepository.getAll().stream()
                .filter(promo -> !promo.getTrangThai().equalsIgnoreCase("Inactive"))
                .count();
        int inactive = (int) promotionRepository.getAll().stream()
                .filter(promo -> promo.getTrangThai().equalsIgnoreCase("Inactive"))
                .count();
        int totalUsage = promotionRepository.getAll().stream()
                .mapToInt(promo -> promo.getHoaDons() != null ? promo.getHoaDons().size() : 0)
                .sum();
        return new PromotionStatsResponseDto(total, active, totalUsage, inactive);
    }
}
