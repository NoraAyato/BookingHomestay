package com.bookinghomestay.app.application.payment.command;

import com.bookinghomestay.app.domain.exception.ResourceNotFoundException;
import com.bookinghomestay.app.domain.model.HoaDon;
import com.bookinghomestay.app.domain.model.ThanhToan;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.repository.IThanhToanRepository;
import com.bookinghomestay.app.domain.service.BookingService;
import com.bookinghomestay.app.domain.service.PaymentService;
import com.bookinghomestay.app.domain.service.PendingRoomService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CreatePaymentCommandHandler {

    private final PaymentService paymentService; // MoMo implementation will be injected
    private final IThanhToanRepository thanhToanRepository;
    private final IBookingRepository bookingRepository;
    private final PendingRoomService pendingRoomService;
    private final BookingService bookingDomainService;

    @Transactional
    public String handle(CreatePaymentCommand command) {
        // 1. Validate booking exists
        var booking = bookingRepository.findById(command.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt phòng này !"));
        bookingDomainService.validatePayment(booking, command.getSoTien());

        var ctdp = booking.getChiTietDatPhongs().get(0);
        String roomId = ctdp.getMaPhong();
        var ngayDen = ctdp.getNgayDen().toLocalDate();
        var ngayDi = ctdp.getNgayDi().toLocalDate();

        boolean isHeldByCurrentUser = pendingRoomService.isRoomHeldByUser(roomId, ngayDen, ngayDi,
                command.getUserId());
        if (!isHeldByCurrentUser) {
            throw new RuntimeException("Phòng không được giữ cho người dùng hiện tại !");
        }

        HoaDon hoaDon = booking.getHoadon();
        if (hoaDon == null) {
            throw new IllegalStateException("Booking chưa có hóa đơn !");
        }

        // 2. Create ThanhToan record with PENDING status
        ThanhToan thanhToan = new ThanhToan();
        thanhToan.setMaTT("PM-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        thanhToan.setSoTien(command.getSoTien());
        thanhToan.setPhuongThuc(command.getPhuongThuc());
        thanhToan.setNgayTT(LocalDateTime.now());
        thanhToan.setTrangThai("PENDING");
        thanhToan.setNoiDung(command.getNoiDung());
        thanhToan.setHoaDon(hoaDon);

        thanhToanRepository.save(thanhToan);

        // 3. Create payment request with MoMo
        log.info("=== Creating MoMo payment ===");
        log.info("Return URL: {}", command.getReturnUrl());
        log.info("Notify URL: {}", command.getNotifyUrl());

        String paymentUrl = paymentService.createPaymentRequest(
                thanhToan.getMaTT(),
                command.getSoTien(),
                command.getNoiDung(),
                command.getReturnUrl(),
                command.getNotifyUrl());

        log.info("Payment URL created: {}", paymentUrl);
        return paymentUrl;
    }
}
