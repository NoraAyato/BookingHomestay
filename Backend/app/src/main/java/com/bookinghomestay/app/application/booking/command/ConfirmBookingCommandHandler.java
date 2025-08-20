package com.bookinghomestay.app.application.booking.command;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

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
import com.bookinghomestay.app.domain.service.BookingDomainService;
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
    private final IKhuyenMaiRepository promotionRepository;
    private final PendingRoomService pendingRoomService;
    private final BookingDomainService bookingDomainService;

    @Transactional
    public BookingPaymentResponseDto handle(ConfirmBookingCommand command) {
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

            // Thêm dịch vụ nếu có
            if (command.getServiceIds() != null && !command.getServiceIds().isEmpty()) {
                for (String serviceId : command.getServiceIds()) {
                    Optional<DichVu> serviceOpt = serviceRepository.findServiceById(serviceId);
                    if (serviceOpt.isPresent()) {
                        DichVu service = serviceOpt.get();
                        ChiTietDichVu chiTietDichVu = bookingDomainService.createServiceDetail(
                                booking.getMaPDPhong(),
                                firstRoomDetail.getMaPhong(),
                                service);
                        booking.getChiTietDatPhongs().get(0).getChiTietDichVus().add(chiTietDichVu);
                        log.info("Added ChiTietDichVu for service ID: {} to booking: {}", serviceId,
                                booking.getMaPDPhong());
                    } else {
                        log.warn("Service not found for ID: {}", serviceId);
                    }
                }
            }

            // Lưu booking với dịch vụ mới
            bookingRepository.save(booking);

            // Tạo hóa đơn
            KhuyenMai khuyenMai = null;
            if (command.getPromotionId() != null) {
                Optional<KhuyenMai> promotionOpt = promotionRepository.getKhuyenMaiById(command.getPromotionId());
                if (promotionOpt.isPresent()) {
                    khuyenMai = promotionOpt.get();
                } else {
                    throw new IllegalArgumentException("Promotion not found");
                }
            }

            BigDecimal total = bookingDomainService.calculateTotalAmountWithPromotion(booking, khuyenMai);
            HoaDon hoaDon = bookingDomainService.createInvoice(booking, total, khuyenMai);
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
            return BookingMapper.toBookingPaymentResponseDto(booking);

        } catch (Exception e) {
            log.error("Error confirming booking: {}", e.getMessage(), e);
            throw e;
        }
    }
}
