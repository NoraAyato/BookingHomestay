package com.bookinghomestay.app.domain.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.model.User;

@Service
public class PromotionService {

    public boolean isPromotionAvailableForUser(
            KhuyenMai khuyenMai,
            User user,
            String maPhong,
            LocalDateTime ngayDen,
            LocalDateTime ngayDi,
            BigDecimal tongGiaTri,
            int soBookingDaHoanThanh) {

        LocalDateTime now = LocalDateTime.now();

        // 1. Kiểm tra trạng thái khuyến mãi
        if (!"Hoạt động".equals(khuyenMai.getTrangThai())) {
            System.out.println("Trạng thái khuyến mãi không hoạt động");
            return false;
        }

        // 2. Kiểm tra thời gian khuyến mãi
        if (now.isBefore(khuyenMai.getNgayBatDau()) || now.isAfter(khuyenMai.getNgayKetThuc())) {
            System.out.println("Thời gian khuyến mãi không hợp lệ");
            return false;
        }

        // 3. Kiểm tra số lượng khuyến mãi còn lại
        if (khuyenMai.getSoLuong() != null && khuyenMai.getSoLuong().compareTo(BigDecimal.ZERO) <= 0) {
            System.out.println("Số lượng khuyến mãi còn lại không hợp lệ");
            return false;
        }

        // 4. Kiểm tra khách mới
        if (khuyenMai.isChiApDungChoKhachMoi() && soBookingDaHoanThanh > 0) {
            System.out.println("Khuyến mãi chỉ áp dụng cho khách mới");
            return false;
        }

        // 5. Kiểm tra số đêm tối thiểu
        if (khuyenMai.getSoDemToiThieu() != null) {
            long soDem = ChronoUnit.DAYS.between(ngayDen.toLocalDate(), ngayDi.toLocalDate());
            if (soDem < khuyenMai.getSoDemToiThieu()) {
                System.out.println("Số đêm tối thiểu không đủ");
                return false;
            }
        }

        // 6. Kiểm tra đặt trước X ngày
        if (khuyenMai.getSoNgayDatTruoc() != null) {
            long soNgayDatTruoc = ChronoUnit.DAYS.between(LocalDate.now(), ngayDen.toLocalDate());
            if (soNgayDatTruoc < khuyenMai.getSoNgayDatTruoc()) {
                System.out.println("Số ngày đặt trước không đủ");
                return false;
            }
        }

        // 7. Kiểm tra giá trị tối thiểu
        if (khuyenMai.getToiThieu() != null && tongGiaTri.compareTo(khuyenMai.getToiThieu()) < 0) {
            System.out.println("Tổng giá trị không đạt mức tối thiểu");
            return false;
        }

        // 8. Kiểm tra phòng áp dụng
        if (!khuyenMai.isApDungChoTatCaPhong()) {
            // Nếu không áp dụng cho tất cả phòng, kiểm tra phòng cụ thể
            if (khuyenMai.getKhuyenMaiPhongs() == null || khuyenMai.getKhuyenMaiPhongs().isEmpty()) {
                System.out.println("Không có phòng áp dụng cho khuyến mãi");
                return false;
            }

            boolean phongHopLe = khuyenMai.getKhuyenMaiPhongs().stream()
                    .anyMatch(kmp -> kmp.getPhong() != null && kmp.getPhong().getMaPhong().equals(maPhong));

            if (!phongHopLe) {
                System.out.println("Phòng không hợp lệ cho khuyến mãi");
                return false;
            }
        }

        // Tất cả điều kiện đều thỏa mãn
        return true;
    }

    /**
     * Lấy danh sách khuyến mãi khả dụng cho user
     */
    public List<KhuyenMai> getAvailablePromotionsForUser(
            List<KhuyenMai> allPromotions,
            User user,
            String maPhong,
            LocalDateTime ngayDen,
            LocalDateTime ngayDi,
            BigDecimal tongGiaTri,
            int soBookingDaHoanThanh) {

        return allPromotions.stream()
                .filter(km -> isPromotionAvailableForUser(
                        km, user, maPhong, ngayDen, ngayDi, tongGiaTri, soBookingDaHoanThanh))
                .toList();
    }

    public BigDecimal getBestDiscountedPrice(BigDecimal originalPrice, List<KhuyenMai> khuyenMais) {
        return khuyenMais.stream().filter(km -> km.isApDungChoTatCaPhong())
                .map(km -> {
                    if (km.getLoaiChietKhau().equals("percentage")) {
                        return originalPrice
                                .multiply(BigDecimal.ONE.subtract(km.getChietKhau().divide(BigDecimal.valueOf(100))));
                    } else {
                        return originalPrice.subtract(km.getChietKhau());
                    }
                })
                .min(BigDecimal::compareTo)
                .orElse(originalPrice);
    }

    public BigDecimal calculatePercentDiscount(BigDecimal originalPrice, BigDecimal discountPrice) {
        if (discountPrice.compareTo(originalPrice) < 0) {
            return BigDecimal.ONE
                    .subtract(discountPrice.divide(originalPrice, 2, RoundingMode.HALF_UP))
                    .multiply(BigDecimal.valueOf(100));
        }
        return BigDecimal.ZERO;
    }

    public String getPromotionTitle(KhuyenMai khuyenMai) {
        String title = "Giảm ";
        if (khuyenMai.getLoaiChietKhau().equals("Percentage")) {
            title += khuyenMai.getChietKhau().setScale(0, RoundingMode.HALF_UP).toString() + "%";
        } else {
            title += String.format("%,.0f", khuyenMai.getChietKhau()) + " VND";
        }
        if (khuyenMai.isChiApDungChoKhachMoi()) {
            title += " cho khách hàng mới";
        }
        if (khuyenMai.getToiThieu() != null) {
            title += " từ " + String.format("%,.0f", khuyenMai.getToiThieu()) + " VND";
        }
        return title;
    }
}
