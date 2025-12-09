package com.bookinghomestay.app.application.admin.promotion.command;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.bookinghomestay.app.application.admin.promotion.dto.CreatePromotionRequestDto;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.infrastructure.file.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreatePromotionCommandHandler {
    private final IKhuyenMaiRepository khuyenMaiRepository;
    private final FileStorageService fileStorageService;
    private final IUserRepository userRepository;

    public void handler(CreatePromotionRequestDto requestDto, MultipartFile image, String userId) {
        try {
            // Validate required fields
            if (requestDto.getDescription() == null || requestDto.getDescription().isEmpty()) {
                throw new IllegalArgumentException("Mô tả không được để trống");
            }
            if (requestDto.getDiscountValue() == null) {
                throw new IllegalArgumentException("Giá trị giảm giá không được để trống");
            }
            if (requestDto.getStartDate() == null || requestDto.getEndDate() == null) {
                throw new IllegalArgumentException("Ngày bắt đầu và kết thúc không được để trống");
            }
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            KhuyenMai promotion = new KhuyenMai();
            promotion.setMaKM("KM" + String.valueOf(System.currentTimeMillis()).substring(7));
            promotion.setNoiDung(requestDto.getDescription());
            promotion.setLoaiChietKhau(
                    requestDto.getDiscountType() != null ? requestDto.getDiscountType() : "percentage");

            // Convert String → Integer/BigDecimal/LocalDate/Boolean
            promotion.setChietKhau(BigDecimal.valueOf(Integer.parseInt(requestDto.getDiscountValue())));
            promotion.setNgayBatDau(requestDto.getStartDate().atStartOfDay());
            promotion.setNgayKetThuc(requestDto.getEndDate().atStartOfDay());
            promotion.setSoNgayDatTruoc(
                    requestDto.getMinBookedDays() != null ? Integer.parseInt(requestDto.getMinBookedDays()) : 0);
            promotion.setSoDemToiThieu(
                    requestDto.getMinNights() != null ? Integer.parseInt(requestDto.getMinNights()) : 0);
            promotion.setToiThieu(
                    requestDto.getMinValue() != null ? BigDecimal.valueOf(Integer.parseInt(requestDto.getMinValue()))
                            : BigDecimal.ZERO);
            promotion.setSoLuong(
                    requestDto.getQuantity() != null ? BigDecimal.valueOf(Integer.parseInt(requestDto.getQuantity()))
                            : BigDecimal.ZERO);
            promotion.setTrangThai(requestDto.getStatus() != null ? requestDto.getStatus() : "active");
            promotion.setChiApDungChoKhachMoi(
                    requestDto.getIsForNewCustomer() != null ? Boolean.parseBoolean(requestDto.getIsForNewCustomer())
                            : false);
            promotion.setApDungChoTatCaPhong(true);
            promotion.setNgayTao(LocalDateTime.now());
            promotion.setNguoiTao(user);
            // Upload ảnh nếu có
            if (image != null && !image.isEmpty() && image.getSize() > 0) {
                String imageUrl = fileStorageService.storePromotion(image, "pm_");
                promotion.setHinhAnh(imageUrl);
            }

            khuyenMaiRepository.save(promotion);
        } catch (Exception e) {
            throw new RuntimeException("Tạo khuyến mãi thất bại: " + e.getMessage());
        }
    }
}
