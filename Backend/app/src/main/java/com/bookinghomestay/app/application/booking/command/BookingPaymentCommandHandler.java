package com.bookinghomestay.app.application.booking.command;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookinghomestay.app.domain.model.HoaDon;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.model.ThanhToan;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.service.BookingService;
import com.bookinghomestay.app.domain.service.PendingRoomService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingPaymentCommandHandler {

    private final IBookingRepository bookingRepository;
    private final PendingRoomService pendingRoomService;
    private final BookingService bookingDomainService;

    @Transactional
    public void handle(BookingPaymentCommand command) {
        try {
            log.info("Processing payment for booking {}", command.getMaPDPhong());
            Optional<PhieuDatPhong> bookingOpt = bookingRepository.findById(command.getMaPDPhong());

            if (bookingOpt.isEmpty()) {
                throw new RuntimeException("Booking not found");
            }

            PhieuDatPhong booking = bookingOpt.get();

            // Kiểm tra tính hợp lệ của thanh toán
            bookingDomainService.validatePayment(booking, command.getSoTien());

            var ctdp = booking.getChiTietDatPhongs().get(0);
            String roomId = ctdp.getMaPhong();
            var ngayDen = ctdp.getNgayDen().toLocalDate();
            var ngayDi = ctdp.getNgayDi().toLocalDate();

            boolean isHeldByCurrentUser = pendingRoomService.isRoomHeldByUser(roomId, ngayDen, ngayDi,
                    command.getUserId());
            if (!isHeldByCurrentUser) {
                throw new RuntimeException("Room is not held by you or hold expired. Cannot proceed payment.");
            }

            // Tạo thanh toán
            ThanhToan thanhToan = new ThanhToan();
            thanhToan.setMaTT(UUID.randomUUID().toString().replace("-", "").substring(0, 20));
            thanhToan.setNgayTT(LocalDateTime.now());
            thanhToan.setPhuongThuc(command.getPhuongThuc());
            thanhToan.setSoTien(command.getSoTien());
            thanhToan.setTrangThai("Success");
            thanhToan.setNoiDung("Payment for booking " + booking.getMaPDPhong());
            thanhToan.setHoaDon(booking.getHoadon());

            List<ThanhToan> thanhToans = booking.getHoadon().getThanhToans();
            if (thanhToans == null) {
                thanhToans = new ArrayList<>();
                booking.getHoadon().setThanhToans(thanhToans);
            }
            thanhToans.add(thanhToan);

            // Cập nhật trạng thái hóa đơn và booking
            booking.getHoadon().setTrangThai("Paid");
            booking.setTrangThai("Booked");

            // Giải phóng phòng đã giữ
            pendingRoomService.releaseRoom(roomId, ngayDen, ngayDi);

            // Lưu booking
            bookingRepository.save(booking);

            log.info("Payment processed successfully for booking {}", booking.getMaPDPhong());
        } catch (Exception e) {
            log.error("Error processing payment for booking {}: {}", command.getMaPDPhong(), e.getMessage(), e);
            throw e;
        }
    }
}
