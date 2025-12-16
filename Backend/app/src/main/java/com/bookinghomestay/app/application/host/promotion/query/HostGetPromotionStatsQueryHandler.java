package com.bookinghomestay.app.application.host.promotion.query;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.promotion.dto.PromotionStatsResponseDto;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HostGetPromotionStatsQueryHandler {
        private final IKhuyenMaiRepository promotionRepository;

        public PromotionStatsResponseDto handle(String hostId) {
                List<KhuyenMai> promotions = promotionRepository.getAll().stream()
                                .filter(promotion -> promotion.getNguoiTao().getUserId().equalsIgnoreCase(hostId))
                                .toList();
                int total = promotions.size();
                int active = (int) promotions.stream()
                                .filter(promo -> !promo.getTrangThai().equalsIgnoreCase("Inactive"))
                                .count();
                int inactive = (int) promotions.stream()
                                .filter(promo -> promo.getTrangThai().equalsIgnoreCase("Inactive"))
                                .count();
                int totalUsage = promotions.stream()
                                .mapToInt(promo -> promo.getHoaDons() != null ? promo.getHoaDons().size() : 0)
                                .sum();
                return new PromotionStatsResponseDto(total, active, totalUsage, inactive);
        }
}
