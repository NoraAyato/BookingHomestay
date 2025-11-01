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
        try {

            PhieuDatPhong booking = bookingRepository.findById(command.getBookingId())
                    .orElseThrow(() -> new IllegalArgumentException("Đơn đặt phòng không tồn tại"));
            HoaDon hoaDon = booking.getHoadon();
            if (hoaDon == null) {
                throw new IllegalStateException("Đơn đặt phòng chưa có hóa đơn");
            }
            // Tạo hóa đơn
            final KhuyenMai khuyenMai;
            BigDecimal promotionRemainCount = BigDecimal.ZERO;
            if (command.getPromotionCode() != null) {
                Optional<KhuyenMai> promotionOpt = promotionRepository.getKhuyenMaiById(command.getPromotionCode());
                if (promotionOpt.isPresent()) {
                    khuyenMai = promotionOpt.get();
                    promotionRemainCount = khuyenMai.getSoLuong();
                    // Validate khuyến mãi cho từng phòng
                    boolean isValid = booking.getChiTietDatPhongs().stream()
                            .allMatch(item -> promotionService.isPromotionAvailableForUser(
                                    khuyenMai,
                                    booking.getNguoiDung(),
                                    item.getMaPhong(),
                                    item.getNgayDen(),
                                    item.getNgayDi(),
                                    bookingDomainService.calculateTotalAmount(booking),
                                    userService.countBookingComplete(booking.getNguoiDung())));

                    if (!isValid) {
                        throw new IllegalArgumentException("Khuyến mãi không khả dụng cho booking này!");
                    }
                } else {
                    throw new IllegalArgumentException("Không tìm thấy khuyến mãi !");
                }
            } else {
                khuyenMai = null;
            }

            BigDecimal total = bookingDomainService.calculateTotalAmountWithPromotion(booking, khuyenMai);
            invoiceFactory.addPromotion(hoaDon, khuyenMai, total);
            bookingRepository.save(booking);
            khuyenMai.setSoLuong(promotionRemainCount.subtract(BigDecimal.ONE));
            promotionRepository.updateKhuyenMai(khuyenMai);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi thêm khuyến mãi vào đơn đặt phòng: " + e.getMessage(), e);
        }
    }
}
