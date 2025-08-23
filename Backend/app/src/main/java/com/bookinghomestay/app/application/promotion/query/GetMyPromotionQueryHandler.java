package com.bookinghomestay.app.application.promotion.query;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.api.dto.promotion.PromotionResponeDto;
import com.bookinghomestay.app.domain.exception.BusinessException;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;

import com.bookinghomestay.app.infrastructure.mapper.PromotionMapper;
import com.bookinghomestay.app.domain.exception.BusinessException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetMyPromotionQueryHandler {

    private final IKhuyenMaiRepository khuyenMaiRepository;
    private final IBookingRepository bookingRepository;

    public List<PromotionResponeDto> handle(GetMyPromotionQuery query) {
        boolean isNewCustomer = isNewCustomer(query.getUserId());
        var booking = bookingRepository.findById(query.getMaPDPhong());
        AtomicReference<String> maPhongRef = new AtomicReference<>("");
        booking.ifPresent(b -> {
            if (b.getChiTietDatPhongs().get(0).getMaPhong() != null) {
                maPhongRef.set(b.getChiTietDatPhongs().get(0).getMaPhong());
            } else {
                throw new BusinessException("Phiếu đặt phòng không chứa mã phòng hợp lệ");
            }
        });
        String maPhong = maPhongRef.get();

        List<KhuyenMai> allPromos = khuyenMaiRepository.getAllPromotionsForRoom(maPhong);
        if (allPromos.isEmpty()) {
            allPromos = khuyenMaiRepository.getAdminKm();
        }
        var validPromos = allPromos.stream()
                .filter(km -> !LocalDate.now().isAfter(km.getNgayKetThuc().toLocalDate()))
                .filter(km -> km.getSoNgayDatTruoc() == null ||
                        ChronoUnit.DAYS.between(LocalDate.now(), query.getNgayDen()) >= km.getSoNgayDatTruoc())
                .filter(km -> km.getSoDemToiThieu() == null ||
                        ChronoUnit.DAYS.between(query.getNgayDen(), query.getNgayDi()) >= km.getSoDemToiThieu())
                .filter(km -> !km.isChiApDungChoKhachMoi() || isNewCustomer)

                .toList();
        return PromotionMapper.toDtoList(validPromos);
    }

    private boolean isNewCustomer(String userId) {
        return bookingRepository.countByUserIdAndTrangThai(userId, "Completed") > 0 ? false : true;
    }
}
