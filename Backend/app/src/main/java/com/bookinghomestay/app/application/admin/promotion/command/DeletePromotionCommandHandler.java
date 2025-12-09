package com.bookinghomestay.app.application.admin.promotion.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.repository.IKhuVucRepository;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeletePromotionCommandHandler {
    private final IKhuyenMaiRepository promotionRepository;

    public void handler(String id) {
        try {
            var promotion = promotionRepository.getKhuyenMaiById(id)
                    .orElseThrow(() -> new RuntimeException("Promotion not found"));
            if (promotion.getHoaDons() != null && promotion.getHoaDons().size() > 0) {
                throw new RuntimeException("Không thể xóa khuyến mãi này vì có hóa đơn đã sử dụng khuyến mãi này !");
            }
            promotion.setTrangThai("inactive");
            promotionRepository.save(promotion);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi xóa khuyến mãi: " + e.getMessage());
        }
    }
}
