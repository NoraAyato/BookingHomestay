package com.bookinghomestay.app.infrastructure.scheduler;

import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.service.PendingRoomService;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class BookingScheduler {

    private final IBookingRepository bookingRepository;
    private final PendingRoomService pendingRoomService;

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void releaseExpiredBookings() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(15);
        List<PhieuDatPhong> expiredBookings = bookingRepository.findPendingExpired(cutoff);

        if (!expiredBookings.isEmpty()) {
            log.info("Found {} expired bookings to check", expiredBookings.size());
        }

        for (PhieuDatPhong booking : expiredBookings) {
            try {
                // Kiểm tra xem tất cả các phòng trong booking này còn đang hold không
                boolean allRoomsStillOnHold = booking.getChiTietDatPhongs().stream()
                        .allMatch(ct -> !pendingRoomService.isRoomAvailable(
                                ct.getMaPhong(),
                                ct.getNgayDen().toLocalDate(),
                                ct.getNgayDi().toLocalDate()));

                // Nếu phòng vẫn đang hold, bỏ qua booking này
                if (allRoomsStillOnHold) {
                    log.info("Booking {} is still on hold, skipping", booking.getMaPDPhong());
                    continue;
                }

                // Thực hiện xử lý cho những booking có phòng không còn hold
                booking.getChiTietDatPhongs().forEach(ct -> {
                    // Đảm bảo giải phóng bất kỳ phòng nào có thể vẫn còn trong Redis
                    pendingRoomService.releaseRoom(
                            ct.getMaPhong(),
                            ct.getNgayDen().toLocalDate(),
                            ct.getNgayDi().toLocalDate());
                });

                booking.setTrangThai("Cancelled");
                if (booking.getHoadon() != null) {
                    booking.getHoadon().setTrangThai("Cancelled");
                }
                bookingRepository.save(booking);

                log.info("Booking {} is cancelled due to expiration and rooms not being on hold",
                        booking.getMaPDPhong());
            } catch (Exception e) {
                log.error("Error processing booking {}", booking.getMaPDPhong(), e);
            }
        }
    }
}
