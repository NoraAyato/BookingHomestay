package com.bookinghomestay.app.application.promotion.query;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.promotion.dto.AvailablePromotionResponseDto;
import com.bookinghomestay.app.domain.exception.BusinessException;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.PromotionService;
import com.bookinghomestay.app.domain.service.UserService;
import com.bookinghomestay.app.infrastructure.mapper.PromotionMapper;
import com.bookinghomestay.app.domain.exception.BusinessException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAvailablePromotionQueryHandler {

    private final IKhuyenMaiRepository khuyenMaiRepository;
    private final IBookingRepository bookingRepository;
    private final PromotionService promotionService;
    private final IUserRepository userRepository;
    private final UserService userService;

    public List<AvailablePromotionResponseDto> handle(GetAvailablePromotionQuery query) {

        var user = userRepository.findById(query.getUserId())
                .orElseThrow(() -> new BusinessException("User not found"));

        boolean isNewCustomer = userService.countBookingComplete(user) > 0 ? false : true;
        var booking = bookingRepository.findById(query.getMaPDPhong());

        String maPhong = "";
        if (booking.isPresent()) {
            maPhong = booking.get().getChiTietDatPhongs().get(0).getMaPhong();
        }
        var ngayDen = booking.get().getChiTietDatPhongs().get(0).getNgayDen().toLocalDate();
        var ngayDi = booking.get().getChiTietDatPhongs().get(0).getNgayDi().toLocalDate();
        List<KhuyenMai> allPromos = khuyenMaiRepository.getAllPromotionsForRoom(maPhong);
        if (allPromos.isEmpty()) {
            allPromos = khuyenMaiRepository.getAdminKm();
        }
        var validPromos = allPromos.stream()
                .filter(km -> !LocalDate.now().isAfter(km.getNgayKetThuc().toLocalDate()))
                .filter(km -> !LocalDate.now().isBefore(km.getNgayBatDau().toLocalDate()))
                .filter(km -> km.getTrangThai().equalsIgnoreCase("active"))
                .filter(km -> km.getSoNgayDatTruoc() == null ||
                        ChronoUnit.DAYS.between(LocalDate.now(), ngayDen) >= km.getSoNgayDatTruoc())
                .filter(km -> km.getSoDemToiThieu() == null ||
                        ChronoUnit.DAYS.between(ngayDen, ngayDi) >= km.getSoDemToiThieu())
                .filter(km -> !km.isChiApDungChoKhachMoi() || isNewCustomer)
                .map(km -> PromotionMapper.toAvailableDto(km, promotionService.getPromotionTitle(km)))
                .toList();
        return validPromos;
    }

}
