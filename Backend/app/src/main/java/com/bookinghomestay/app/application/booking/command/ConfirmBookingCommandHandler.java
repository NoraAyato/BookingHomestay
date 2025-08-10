package com.bookinghomestay.app.application.booking.command;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookinghomestay.app.api.dto.booking.BookingPaymentResponseDto;
import com.bookinghomestay.app.domain.model.ChiTietDichVu;
import com.bookinghomestay.app.domain.model.DichVu;
import com.bookinghomestay.app.domain.model.HoaDon;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;
import com.bookinghomestay.app.domain.repository.IServiceRepository;
import com.bookinghomestay.app.domain.service.PendingRoomService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConfirmBookingCommandHandler {

    private final IBookingRepository bookingRepository;
    private final IServiceRepository serviceRepository;
    private final IKhuyenMaiRepository promotionRepository;
    private final PendingRoomService pendingRoomService;

    @Transactional
    public BookingPaymentResponseDto handle(ConfirmBookingCommand command) {
        try {
            var bookingOpt = bookingRepository.findById(command.getMaPDPhong());
            if (bookingOpt.isEmpty()) {
                throw new RuntimeException("Booking not found");
            }
            var booking = bookingOpt.get();

            if (!"Pending".equals(booking.getTrangThai())) {
                throw new RuntimeException("Booking status is not pending");
            }
            if (booking.getChiTietDatPhongs() == null || booking.getChiTietDatPhongs().isEmpty()) {
                throw new IllegalStateException("Booking does not have any room details.");
            }

            var firstRoomDetail = booking.getChiTietDatPhongs().get(0);
            if (firstRoomDetail.getMaPhong() == null) {
                throw new IllegalStateException("Room ID is missing in booking details.");
            }

            // Thêm dịch vụ nếu có
            if (command.getServiceIds() != null && !command.getServiceIds().isEmpty()) {
                for (String serviceId : command.getServiceIds()) {
                    Optional<DichVu> serviceOpt = serviceRepository.findServiceById(serviceId);
                    if (serviceOpt.isPresent()) {
                        var service = serviceOpt.get();

                        ChiTietDichVu chiTietDichVu = new ChiTietDichVu();
                        chiTietDichVu.setMaPDPhong(booking.getMaPDPhong());
                        chiTietDichVu.setMaPhong(firstRoomDetail.getMaPhong());
                        chiTietDichVu.setMaDV(service.getMaDV());
                        chiTietDichVu.setSoLuong(BigDecimal.ONE);
                        chiTietDichVu.setNgaySuDung(booking.getChiTietDatPhongs().get(0).getNgayDen().toLocalDate());
                        chiTietDichVu.setDichVu(service);
                        booking.getChiTietDatPhongs().get(0).getChiTietDichVus().add(chiTietDichVu);
                        log.info("Added ChiTietDichVu for service ID: {} to booking: {}", serviceId,
                                booking.getMaPDPhong());
                    } else {
                        log.warn("Service not found for ID: {}", serviceId);
                    }
                }
            }
            bookingRepository.save(booking);
            // Tạo hóa đơn
            HoaDon hoaDon = new HoaDon();
            hoaDon.setMaHD(UUID.randomUUID().toString().replace("-", "").substring(0, 20));

            hoaDon.setNgayLap(LocalDateTime.now());

            BigDecimal total = calculateTotalAmount(booking, command.getPromotionId());
            hoaDon.setTongTien(total);
            hoaDon.setThue(total.multiply(new BigDecimal("0.0")));
            hoaDon.setTrangThai("Pending");
            hoaDon.setKhuyenMai(null);
            hoaDon.setPhieudatphong(booking);
            if (command.getPromotionId() != null) {
                Optional<KhuyenMai> promotionOpt = promotionRepository.getKhuyenMaiById(command.getPromotionId());
                if (promotionOpt.isPresent()) {
                    hoaDon.setKhuyenMai(promotionOpt.get());
                } else {
                    throw new IllegalArgumentException("Promotion not found");
                }
            }
            booking.setHoadon(hoaDon);
            // Giữ phòng tạm thời
            boolean holdSuccess = pendingRoomService.holdRoom(
                    booking.getChiTietDatPhongs().get(0).getMaPhong(),
                    booking.getChiTietDatPhongs().get(0).getNgayDen().toLocalDate(),
                    booking.getChiTietDatPhongs().get(0).getNgayDi().toLocalDate(),
                    command.getUserId(),
                    15);
            if (!holdSuccess) {
                throw new RuntimeException("Room is currently held by another user");
            }

            bookingRepository.save(booking);

            return new BookingPaymentResponseDto(
                    booking.getMaPDPhong(),
                    booking.getHoadon().getMaHD(),
                    calculateTotalAmount(booking, command.getPromotionId()),
                    booking.getHoadon().getTrangThai());

        } catch (Exception e) {
            log.error("Error confirming booking: {}", e.getMessage(), e);
            throw e; // Vẫn ném lại lỗi để ControllerAdvice hoặc Spring xử lý trả về client
        }
    }

    /**
     * Tính tổng tiền của booking.
     * Giảm giá chỉ áp dụng cho tiền phòng, không áp dụng cho dịch vụ.
     */
    private BigDecimal calculateTotalAmount(PhieuDatPhong booking, String promotionId) {

        // Tính tiền phòng
        BigDecimal roomPrice = booking.getChiTietDatPhongs().stream()
                .map(ctdp -> {
                    long nights = ChronoUnit.DAYS.between(
                            ctdp.getNgayDen().toLocalDate(),
                            ctdp.getNgayDi().toLocalDate());
                    return ctdp.getPhong().getDonGia().multiply(BigDecimal.valueOf(nights));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Áp dụng khuyến mãi nếu có
        if (promotionId != null) {
            var promoOpt = promotionRepository.getKhuyenMaiById(promotionId);
            if (promoOpt.isPresent()) {
                KhuyenMai promo = promoOpt.get();
                if ("percentage".equalsIgnoreCase(promo.getLoaiChietKhau())) {
                    BigDecimal discount = roomPrice.multiply(
                            promo.getChietKhau().divide(new BigDecimal("100")));
                    roomPrice = roomPrice.subtract(discount);
                } else {
                    roomPrice = roomPrice.subtract(
                            promo.getChietKhau().multiply(BigDecimal.valueOf(1000)));
                }
            }
        }

        // Tính tiền dịch vụ (không giảm giá)
        BigDecimal servicePrice = booking.getChiTietDatPhongs().stream()
                .map(ctdp -> {
                    long nights = ChronoUnit.DAYS.between(
                            ctdp.getNgayDen().toLocalDate(),
                            ctdp.getNgayDi().toLocalDate());
                    BigDecimal serviceTotalForRoom = ctdp.getChiTietDichVus().stream()
                            .map(ctdv -> ctdv.getDichVu().getDonGia())
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return serviceTotalForRoom.multiply(BigDecimal.valueOf(nights));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Tổng cộng
        BigDecimal total = roomPrice.add(servicePrice);
        return total.max(BigDecimal.ZERO);
    }
}
