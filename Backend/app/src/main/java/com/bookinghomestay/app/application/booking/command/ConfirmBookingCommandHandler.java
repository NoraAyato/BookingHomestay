package com.bookinghomestay.app.application.booking.command;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookinghomestay.app.api.dto.booking.BookingPaymentResponseDto;
import com.bookinghomestay.app.api.dto.booking.BookingResponseDto;
import com.bookinghomestay.app.domain.factory.BookingFactory;
import com.bookinghomestay.app.domain.model.ChiTietDatPhong;
import com.bookinghomestay.app.domain.model.ChiTietDichVu;
import com.bookinghomestay.app.domain.model.DichVu;
import com.bookinghomestay.app.domain.model.HoaDon;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;
import com.bookinghomestay.app.domain.repository.IServiceRepository;
import com.bookinghomestay.app.domain.service.BookingService;
import com.bookinghomestay.app.domain.service.PendingRoomService;
import com.bookinghomestay.app.infrastructure.mapper.BookingMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConfirmBookingCommandHandler {

    private final IBookingRepository bookingRepository;
    private final IServiceRepository serviceRepository;
    private final PendingRoomService pendingRoomService;
    private final BookingService bookingDomainService;
    private final BookingFactory bookingFactory;

    @Transactional
    public String handle(ConfirmBookingCommand command) {
        try {
            // Lấy booking từ repository
            var bookingOpt = bookingRepository.findById(command.getMaPDPhong());
            if (bookingOpt.isEmpty()) {
                throw new RuntimeException("Booking not found");
            }
            var booking = bookingOpt.get();

            // Kiểm tra tính hợp lệ của booking
            bookingDomainService.validateBookingConfirmation(booking);
            var firstRoomDetail = booking.getChiTietDatPhongs().get(0);
            if (command.getRoomIds() != null && !command.getRoomIds().isEmpty()) {
                booking = bookingFactory.addRoom(booking, command.getRoomIds());
            }
            // Thêm dịch vụ nếu có
            if (command.getServiceIds() != null && !command.getServiceIds().isEmpty()) {
                for (String serviceId : command.getServiceIds()) {
                    Optional<DichVu> serviceOpt = serviceRepository.findServiceById(serviceId);
                    if (serviceOpt.isPresent()) {
                        DichVu service = serviceOpt.get();
                        booking.getChiTietDatPhongs().forEach(cdphong -> {
                            // ✅ Khởi tạo list nếu null
                            if (cdphong.getChiTietDichVus() == null) {
                                cdphong.setChiTietDichVus(new java.util.ArrayList<>());
                            }

                            ChiTietDichVu chiTietDichVu = bookingDomainService.createServiceDetail(
                                    cdphong.getMaPDPhong(),
                                    cdphong.getMaPhong(),
                                    service);
                            cdphong.getChiTietDichVus().add(chiTietDichVu);
                        });
                    }
                }
            }

            // Lưu booking với dịch vụ mới
            bookingRepository.save(booking);

            BigDecimal total = bookingDomainService.calculateTotalAmountWithPromotion(booking, null);
            HoaDon hoaDon = bookingDomainService.createInvoice(booking, total, null);
            booking.setHoadon(hoaDon);

            // Giữ phòng tạm thời
            boolean holdSuccess = pendingRoomService.holdRoom(
                    firstRoomDetail.getMaPhong(),
                    firstRoomDetail.getNgayDen().toLocalDate(),
                    firstRoomDetail.getNgayDi().toLocalDate(),
                    command.getUserId(),
                    15);

            if (!holdSuccess) {
                throw new RuntimeException("Room is currently held by another user");
            }

            // Lưu booking với hóa đơn mới
            bookingRepository.save(booking);

            // Trả về response
            return booking.getMaPDPhong();

        } catch (Exception e) {
            log.error("Error confirming booking: {}", e.getMessage(), e);
            throw e;
        }
    }
}
