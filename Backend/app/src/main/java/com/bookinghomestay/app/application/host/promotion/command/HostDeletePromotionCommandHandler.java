package com.bookinghomestay.app.application.host.promotion.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HostDeletePromotionCommandHandler {
    private final IKhuyenMaiRepository promotionRepository;

    public void handler(String id, String hostId) {
        try {
            var promotion = promotionRepository.getKhuyenMaiById(id)
                    .orElseThrow(() -> new RuntimeException("Promotion not found"));
            if (!promotion.getNguoiTao().getUserId().equalsIgnoreCase(hostId)) {
                throw new RuntimeException("Không có quyền xóa khuyến mãi này");
            }
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
