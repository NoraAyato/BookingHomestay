package com.bookinghomestay.app.application.admin.promotion.command;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;
import com.bookinghomestay.app.infrastructure.file.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UpdatePromotionCommandHandler {
    private final IKhuyenMaiRepository khuyenMaiRepository;
    private final FileStorageService fileStorageService;

    public void handle(UpdatePromotionCommand command) {
        try {
            var promotion = khuyenMaiRepository.getKhuyenMaiById(command.getPromotionId())
                    .orElseThrow(() -> new IllegalArgumentException("Khuyến mãi không tồn tại"));
            promotion.setNoiDung(command.getDescription());
            promotion.setLoaiChietKhau(command.getDiscountType());
            promotion.setChietKhau(BigDecimal.valueOf(command.getDiscountValue()));
            promotion.setNgayBatDau(command.getStartDate().atStartOfDay());
            promotion.setNgayKetThuc(command.getEndDate().atStartOfDay());
            promotion.setSoNgayDatTruoc(command.getMinBookedDays());
            promotion.setSoDemToiThieu(command.getMinNights());
            promotion.setToiThieu(BigDecimal.valueOf(command.getMinValue()));
            promotion.setSoLuong(BigDecimal.valueOf(command.getQuantity()));
            promotion.setTrangThai(command.getStatus());

            // Chỉ upload ảnh mới khi có file thật (không null, không rỗng, có kích thước)
            if (command.getImage() != null
                    && !command.getImage().isEmpty()
                    && command.getImage().getSize() > 0) {
                String imageUrl = fileStorageService.storePromotion(command.getImage(), "pm_");
                promotion.setHinhAnh(imageUrl);
            }
            // Nếu không có ảnh mới, giữ nguyên ảnh cũ

            promotion.setChiApDungChoKhachMoi(command.getIsForNewCustomer());
            promotion.setApDungChoTatCaPhong(true);
            khuyenMaiRepository.save(promotion);
        } catch (Exception e) {
            throw new RuntimeException("Cập nhật khuyến mãi thất bại: " + e.getMessage());
        }

    }
}
