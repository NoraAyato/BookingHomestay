package com.bookinghomestay.app.domain.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.exception.BusinessException;
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
        if (!"Active".equalsIgnoreCase(khuyenMai.getTrangThai())) {
            System.out.println("Trạng thái khuyến mãi không hoạt động");
            throw new BusinessException("Trạng thái khuyến mãi không hoạt động");
        }

        // 2. Kiểm tra thời gian khuyến mãi
        if (now.isBefore(khuyenMai.getNgayBatDau()) || now.isAfter(khuyenMai.getNgayKetThuc())) {
            System.out.println("Thời gian khuyến mãi không hợp lệ");
            throw new BusinessException("Thời gian khuyến mãi không hợp lệ");
        }
        int countUsedPromotions = khuyenMai.getHoaDons() != null ? khuyenMai.getHoaDons().size() : 0;
        // 3. Kiểm tra số lượng khuyến mãi còn lại
        if (khuyenMai.getSoLuong() != null && khuyenMai.getSoLuong().intValue() < countUsedPromotions) {
            System.out.println("Số lượng khuyến mãi còn lại không hợp lệ");
            throw new BusinessException("Số lượng khuyến mãi còn lại không hợp lệ");
        }

        // 4. Kiểm tra khách mới
        if (khuyenMai.isChiApDungChoKhachMoi() && soBookingDaHoanThanh > 0) {
            System.out.println("Khuyến mãi chỉ áp dụng cho khách mới");
            throw new BusinessException("Khuyến mãi chỉ áp dụng cho khách mới");
        }

        // 5. Kiểm tra số đêm tối thiểu
        if (khuyenMai.getSoDemToiThieu() != null) {
            long soDem = ChronoUnit.DAYS.between(ngayDen.toLocalDate(), ngayDi.toLocalDate());
            if (soDem < khuyenMai.getSoDemToiThieu()) {
                System.out.println("Số đêm tối thiểu không đủ");
                throw new BusinessException("Số đêm tối thiểu không đủ");
            }
        }

        // 6. Kiểm tra đặt trước X ngày
        if (khuyenMai.getSoNgayDatTruoc() != null) {
            long soNgayDatTruoc = ChronoUnit.DAYS.between(LocalDate.now(), ngayDen.toLocalDate());
            if (soNgayDatTruoc < khuyenMai.getSoNgayDatTruoc()) {
                System.out.println("Số ngày đặt trước không đủ");
                throw new BusinessException("Số ngày đặt trước không đủ");
            }
        }

        // 7. Kiểm tra giá trị tối thiểu
        if (khuyenMai.getToiThieu() != null && tongGiaTri.compareTo(khuyenMai.getToiThieu()) < 0) {
            System.out.println("Tổng giá trị không đạt mức tối thiểu");
            throw new BusinessException("Tổng giá trị không đạt mức tối thiểu: " + tongGiaTri.toString());
        }

        // 8. Kiểm tra phòng áp dụng
        if (!khuyenMai.isApDungChoTatCaPhong()) {
            // Nếu không áp dụng cho tất cả phòng, kiểm tra phòng cụ thể
            if (khuyenMai.getKhuyenMaiPhongs() == null || khuyenMai.getKhuyenMaiPhongs().isEmpty()) {
                System.out.println("Không có phòng áp dụng cho khuyến mãi");
                throw new BusinessException("Không có phòng áp dụng cho khuyến mãi");
            }

            boolean phongHopLe = khuyenMai.getKhuyenMaiPhongs().stream()
                    .anyMatch(kmp -> kmp.getPhong() != null && kmp.getPhong().getMaPhong().equals(maPhong));

            if (!phongHopLe) {
                System.out.println("Phòng không hợp lệ cho khuyến mãi");
                throw new BusinessException("Phòng không hợp lệ cho khuyến mãi");
            }
        }

        // Tất cả điều kiện đều thỏa mãn
        return true;
    }

    /**
     * Filter theo khoảng thời gian
     */
    public boolean filterByDateRange(KhuyenMai promotion, LocalDate startDate, LocalDate endDate) {
        if (startDate == null && endDate == null) {
            return true;
        }

        LocalDateTime promotionStart = promotion.getNgayBatDau();
        LocalDateTime promotionEnd = promotion.getNgayKetThuc();

        if (startDate != null) {
            LocalDateTime queryStartDateTime = LocalDateTime.of(startDate, LocalTime.MIN);
            if (promotionEnd.isBefore(queryStartDateTime)) {
                return false;
            }
        }

        if (endDate != null) {
            LocalDateTime queryEndDateTime = LocalDateTime.of(endDate, LocalTime.MAX);
            if (promotionStart.isAfter(queryEndDateTime)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Filter theo search text (tìm trong mã KM và nội dung)
     */
    public boolean filterBySearch(KhuyenMai promotion, String search) {
        if (search == null || search.trim().isEmpty()) {
            return true;
        }

        String searchLower = search.toLowerCase().trim();

        // Tìm trong mã khuyến mãi
        if (promotion.getMaKM() != null &&
                promotion.getMaKM().toLowerCase().contains(searchLower)) {
            return true;
        }

        // Tìm trong nội dung
        if (promotion.getNoiDung() != null &&
                promotion.getNoiDung().toLowerCase().contains(searchLower)) {
            return true;
        }

        return false;
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
        for (KhuyenMai km : khuyenMais) {
            System.out.println("Khuyến mãi: " + getPromotionTitle(km));
        }
        return khuyenMais.stream().filter(km -> km.isApDungChoTatCaPhong())
                .map(km -> {
                    if (km.getLoaiChietKhau().equalsIgnoreCase("percentage")) {
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
        System.out.println("Original Price: " + originalPrice);
        System.out.println("Discount Price: " + discountPrice);
        if (discountPrice.compareTo(originalPrice) < 0) {
            return BigDecimal.ONE
                    .subtract(discountPrice.divide(originalPrice, 2, RoundingMode.HALF_UP))
                    .multiply(BigDecimal.valueOf(100));
        }
        return BigDecimal.ZERO;
    }

    public String getPromotionTitle(KhuyenMai khuyenMai) {
        String title = "Giảm ";
        if (khuyenMai.getLoaiChietKhau().equalsIgnoreCase("Percentage")) {
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

    public List<String> getPromotionHomestayNames(KhuyenMai khuyenMai) {
        return khuyenMai.getKhuyenMaiPhongs().stream()
                .map(kmp -> kmp.getPhong() != null && kmp.getPhong().getHomestay() != null
                        ? kmp.getPhong().getHomestay().getTenHomestay()
                        : "")
                .distinct()
                .toList();
    }
}
