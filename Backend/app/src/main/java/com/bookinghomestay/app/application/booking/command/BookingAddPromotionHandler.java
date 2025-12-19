package com.bookinghomestay.app.application.booking.command;

import java.math.BigDecimal;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.factory.InvoiceFactory;
import com.bookinghomestay.app.domain.model.HoaDon;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;
import com.bookinghomestay.app.domain.service.BookingService;
import com.bookinghomestay.app.domain.service.PromotionService;
import com.bookinghomestay.app.domain.service.UserService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingAddPromotionHandler {
    private final IBookingRepository bookingRepository;
    private final IKhuyenMaiRepository promotionRepository;
    private final BookingService bookingDomainService;
    private final InvoiceFactory invoiceFactory;
    private final PromotionService promotionService;
    private final UserService userService;

    @Transactional
    public void handle(BookingAddPromotionCommand command) {
        // Validate input
        validateCommand(command);

        // Lấy thông tin booking và hóa đơn
        PhieuDatPhong booking = bookingRepository.findById(command.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException("Đơn đặt phòng không tồn tại"));

        HoaDon hoaDon = booking.getHoadon();
        if (hoaDon == null) {
            throw new IllegalStateException("Đơn đặt phòng chưa có hóa đơn");
        }

        if (hoaDon.getKhuyenMai() != null) {
            throw new IllegalStateException("Đơn đặt phòng đã có khuyến mãi áp dụng");
        }

        // Lấy và validate khuyến mãi
        KhuyenMai khuyenMai = getAndValidatePromotion(command.getPromotionCode(), booking);

        // Tính toán và cập nhật hóa đơn
        BigDecimal total = bookingDomainService.calculateTotalAmountWithPromotion(booking, khuyenMai);
        if (total.compareTo(BigDecimal.ZERO) <= 0) {
            total = BigDecimal.ONE.multiply(new BigDecimal(1000));
        }
        invoiceFactory.addPromotion(hoaDon, khuyenMai, total);
        bookingRepository.save(booking);
    }

    /**
     * Validate command input
     */
    private void validateCommand(BookingAddPromotionCommand command) {
        if (command == null) {
            throw new IllegalArgumentException("Command không được null");
        }
        if (command.getBookingId() == null || command.getBookingId().trim().isEmpty()) {
            throw new IllegalArgumentException("Booking ID không được để trống");
        }
        if (command.getPromotionCode() == null || command.getPromotionCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Mã khuyến mãi không được để trống");
        }
    }

    /**
     * Lấy và validate khuyến mãi cho booking
     */
    private KhuyenMai getAndValidatePromotion(String promotionCode, PhieuDatPhong booking) {
        // Lấy khuyến mãi
        KhuyenMai khuyenMai = promotionRepository.getKhuyenMaiById(promotionCode)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khuyến mãi: " + promotionCode));

        // Validate chi tiết đặt phòng
        if (booking.getChiTietDatPhongs() == null || booking.getChiTietDatPhongs().isEmpty()) {
            throw new IllegalStateException("Booking không có chi tiết đặt phòng");
        }

        // Lấy thông tin chung (chỉ tính 1 lần)
        BigDecimal totalAmount = bookingDomainService.calculateTotalAmount(booking);
        int completedBookingCount = userService.countBookingComplete(booking.getNguoiDung());

        // Validate khuyến mãi cho từng phòng
        for (var item : booking.getChiTietDatPhongs()) {
            promotionService.isPromotionAvailableForUser(
                    khuyenMai,
                    booking.getNguoiDung(),
                    item.getMaPhong(),
                    item.getNgayDen(),
                    item.getNgayDi(),
                    totalAmount,
                    completedBookingCount);
        }

        return khuyenMai;
    }
}
