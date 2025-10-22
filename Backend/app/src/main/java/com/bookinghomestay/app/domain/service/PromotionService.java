package com.bookinghomestay.app.domain.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.KhuyenMai;

@Service
public class PromotionService {
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
        if (khuyenMai.getLoaiChietKhau().equals("percentage")) {
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
