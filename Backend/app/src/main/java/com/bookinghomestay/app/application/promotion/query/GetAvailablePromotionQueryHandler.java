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
        // Validate input
        if (query.getMaPDPhong() == null || query.getMaPDPhong().trim().isEmpty()) {
            throw new BusinessException("Mã phiếu đặt phòng không được để trống");
        }

        if (query.getUserId() == null || query.getUserId().trim().isEmpty()) {
            throw new BusinessException("User ID không được để trống");
        }

        // Lấy thông tin user
        var user = userRepository.findById(query.getUserId())
                .orElseThrow(() -> new BusinessException("User not found"));

        // Kiểm tra khách hàng mới (chưa có booking hoàn thành)
        boolean isNewCustomer = userService.countBookingComplete(user) == 0;

        // Lấy thông tin booking
        var booking = bookingRepository.findById(query.getMaPDPhong())
                .orElseThrow(() -> new BusinessException("Không tìm thấy phiếu đặt phòng"));

        // Kiểm tra chi tiết đặt phòng
        if (booking.getChiTietDatPhongs() == null || booking.getChiTietDatPhongs().isEmpty()) {
            throw new BusinessException("Phiếu đặt phòng không có chi tiết");
        }

        var chiTietDatPhong = booking.getChiTietDatPhongs().get(0);
        String maPhong = chiTietDatPhong.getMaPhong();
        LocalDate ngayDen = chiTietDatPhong.getNgayDen().toLocalDate();
        LocalDate ngayDi = chiTietDatPhong.getNgayDi().toLocalDate();

        // Lấy khuyến mãi của phòng cụ thể
        List<KhuyenMai> allPromos = khuyenMaiRepository.getAllPromotionsForRoom(maPhong);

        // Nếu phòng không có khuyến mãi riêng, lấy khuyến mãi áp dụng chung
        if (allPromos.isEmpty()) {
            allPromos = khuyenMaiRepository.getAll().stream()
                    .filter(KhuyenMai::isApDungChoTatCaPhong)
                    .toList();
        }

        LocalDate today = LocalDate.now();

        // Filter khuyến mãi hợp lệ
        var validPromos = allPromos.stream()
                // Kiểm tra trạng thái
                .filter(km -> "active".equalsIgnoreCase(km.getTrangThai()))
                // Kiểm tra thời gian hiệu lực
                .filter(km -> !today.isAfter(km.getNgayKetThuc().toLocalDate()))
                .filter(km -> !today.isBefore(km.getNgayBatDau().toLocalDate()))
                // Kiểm tra số ngày đặt trước
                .filter(km -> km.getSoNgayDatTruoc() == null ||
                        ChronoUnit.DAYS.between(today, ngayDen) >= km.getSoNgayDatTruoc())
                // Kiểm tra số đêm tối thiểu
                .filter(km -> km.getSoDemToiThieu() == null ||
                        ChronoUnit.DAYS.between(ngayDen, ngayDi) >= km.getSoDemToiThieu())
                // Kiểm tra số lượng còn lại
                .filter(km -> {
                    if (km.getSoLuong() == null)
                        return true;
                    int usedCount = (km.getHoaDons() != null) ? km.getHoaDons().size() : 0;
                    return km.getSoLuong().intValue() > usedCount;
                })
                // Kiểm tra điều kiện khách mới
                .filter(km -> !km.isChiApDungChoKhachMoi() || isNewCustomer)
                // Map sang DTO
                .map(km -> PromotionMapper.toAvailableDto(km, promotionService.getPromotionTitle(km)))
                .toList();

        return validPromos;
    }

}
