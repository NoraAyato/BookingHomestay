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
import java.util.ArrayList;
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

        if (expiredBookings.isEmpty()) {
            log.debug("No expired bookings to process");
            return;
        }
        log.info("Found {} expired bookings to check", expiredBookings.size());

        int skipped = 0;
        List<PhieuDatPhong> bookingsToCancel = new ArrayList<>();
        for (PhieuDatPhong booking : expiredBookings) {
            try {
                boolean allRoomsStillOnHold = booking.getChiTietDatPhongs().stream()
                        .allMatch(ct -> !pendingRoomService.isRoomAvailable(
                                ct.getMaPhong(),
                                ct.getNgayDen().toLocalDate(),
                                ct.getNgayDi().toLocalDate()));

                if (allRoomsStillOnHold) {
                    skipped++;
                    continue;
                }

                booking.getChiTietDatPhongs().forEach(ct -> {
                    pendingRoomService.releaseRoom(
                            ct.getMaPhong(),
                            ct.getNgayDen().toLocalDate(),
                            ct.getNgayDi().toLocalDate());
                });

                booking.setTrangThai("Cancelled");
                if (booking.getHoadon() != null) {
                    booking.getHoadon().setTrangThai("Cancelled");
                }
                bookingsToCancel.add(booking);
            } catch (Exception e) {
                log.error("Error processing booking {}", booking.getMaPDPhong(), e);
            }
        }
        if (!bookingsToCancel.isEmpty()) {
            bookingRepository.saveAll(bookingsToCancel);
            log.info("Batch cancelled {} bookings. Skipped {} still on hold.", bookingsToCancel.size(), skipped);
        } else {
            log.info("No bookings cancelled. Skipped {} still on hold.", skipped);
        }
    }
}
