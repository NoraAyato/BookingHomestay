package com.bookinghomestay.app.application.host.bookings.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.repository.IUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UpdateBookingCommandHandler {
    private final IBookingRepository bookingRepository;

    public void handle(String bookingId, String hostId) {
        PhieuDatPhong booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Đơn đặt phòng không tồn tại"));
        boolean isHostValid = booking.getChiTietDatPhongs().get(0).getPhong().getHomestay().getNguoiDung().getUserId()
                .equalsIgnoreCase(hostId);
        if (!isHostValid) {
            throw new IllegalArgumentException("Bạn không có quyền cập nhật đơn đặt phòng này");
        }
        booking.setTrangThai("Completed");

        bookingRepository.save(booking);
    }
}
