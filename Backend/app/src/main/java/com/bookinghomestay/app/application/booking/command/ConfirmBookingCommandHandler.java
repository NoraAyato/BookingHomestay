package com.bookinghomestay.app.application.booking.command;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
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

@Service
@RequiredArgsConstructor
public class ConfirmBookingCommandHandler {
    private final IBookingRepository bookingRepository;
    private final IServiceRepository serviceRepository;
    private final IKhuyenMaiRepository promotionRepository;
    private final PendingRoomService pendingRoomService;

    @Transactional
    public BookingPaymentResponseDto handle(ConfirmBookingCommand command) {
        var bookingOpt = bookingRepository.findById(command.getMaPDPhong());
        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }
        var booking = bookingOpt.get();

        if (!"Pending".equals(booking.getTrangThai())) {
            throw new RuntimeException("Booking status is not pending");
        }
        if (command.getServiceIds() != null && !command.getServiceIds().isEmpty()) {
            for (String serviceId : command.getServiceIds()) {
                Optional<DichVu> serviceOpt = serviceRepository.findServiceById(serviceId);
                if (serviceOpt.isPresent()) {
                    var service = serviceOpt.get();

                    ChiTietDichVu chiTietDichVu = new ChiTietDichVu();
                    chiTietDichVu.setMaPDPhong(booking.getMaPDPhong());
                    chiTietDichVu.setMaPhong(booking.getChiTietDatPhongs().get(0).getMaPhong());
                    chiTietDichVu.setMaDV(service.getMaDV());
                    chiTietDichVu.setSoLuong(BigDecimal.ONE);
                    chiTietDichVu.setNgaySuDung(booking.getChiTietDatPhongs().get(0).getNgayDen().toLocalDate());
                    booking.getChiTietDatPhongs().get(0).getChiTietDichVus().add(chiTietDichVu);
                }
            }
        }

        HoaDon hoaDon = new HoaDon();
        hoaDon.setMaHD(UUID.randomUUID().toString());
        hoaDon.setNgayLap(LocalDateTime.now());

        BigDecimal total = calculateTotalAmount(booking, command.getPromotionId());
        hoaDon.setTongTien(total);

        hoaDon.setThue(total.multiply(new BigDecimal("0.0")));
        hoaDon.setTrangThai("Pending");

        hoaDon.setPhieudatphong(booking);
        booking.setHoadon(hoaDon);
        boolean holdSuccess = pendingRoomService.holdRoom(booking.getChiTietDatPhongs().get(0).getMaPhong(),
                booking.getChiTietDatPhongs().get(0).getNgayDen().toLocalDate(),
                booking.getChiTietDatPhongs().get(0).getNgayDi().toLocalDate(),
                command.getUserId(), 15);
        if (!holdSuccess) {
            throw new RuntimeException("Room is currently held by another user");
        }
        bookingRepository.save(booking);
        return new BookingPaymentResponseDto(
                booking.getMaPDPhong(),
                booking.getHoadon().getMaHD(),
                calculateTotalAmount(booking, command.getPromotionId()),
                booking.getHoadon().getTrangThai());
    }

    private BigDecimal calculateTotalAmount(PhieuDatPhong booking, String promotionId) {

        BigDecimal roomPrice = booking.getChiTietDatPhongs().stream()
                .map(ctdp -> {
                    long nights = ChronoUnit.DAYS.between(ctdp.getNgayDen().toLocalDate(),
                            ctdp.getNgayDi().toLocalDate());
                    return ctdp.getPhong().getDonGia().multiply(BigDecimal.valueOf(nights));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal servicePrice = booking.getChiTietDatPhongs().stream()
                .map(ctdp -> {
                    long nights = ChronoUnit.DAYS.between(ctdp.getNgayDen().toLocalDate(),
                            ctdp.getNgayDi().toLocalDate());
                    BigDecimal serviceTotalForRoom = ctdp.getChiTietDichVus().stream()
                            .map(ctdv -> ctdv.getDichVu().getDonGia())
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return serviceTotalForRoom.multiply(BigDecimal.valueOf(nights));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal total = roomPrice.add(servicePrice);

        if (promotionId != null) {
            var promoOpt = promotionRepository.getKhuyenMaiById(promotionId);
            if (promoOpt.isPresent()) {
                KhuyenMai promo = promoOpt.get();
                if ("Percentage".equalsIgnoreCase(promo.getLoaiChietKhau())) {
                    BigDecimal discount = total.multiply(promo.getChietKhau().divide(new BigDecimal("100")));
                    total = total.subtract(discount);
                } else {
                    total = total.subtract(promo.getChietKhau().multiply(BigDecimal.valueOf(1000)));
                }
            }
        }

        return total.max(BigDecimal.ZERO);
    }
}
