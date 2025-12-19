package com.bookinghomestay.app.application.host.dashboard.query;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.host.dashboard.dto.HostRecentBookingResponseDto;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.BookingService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetHostRecentBookingHandler {
    private final IBookingRepository bookingRepository;
    private final BookingService bookingService;
    private final IUserRepository userRepository;

    public List<HostRecentBookingResponseDto> handle(String hostId) {
        int fetchLimit = 5;

        User host = userRepository.findById(hostId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy host !"));
        // list all bookings of host
        List<PhieuDatPhong> allBookings = bookingService.findBookingByHostId(host.getUserId(),
                bookingRepository.findAllWithHoaDonAndThanhToan());

        var hostBookings = bookingService.findBookingByHostId(hostId, allBookings).stream()
                .sorted((b1, b2) -> b2.getNgayLap().compareTo(b1.getNgayLap()))
                .limit(fetchLimit)
                .map(booking -> new HostRecentBookingResponseDto(
                        booking.getMaPDPhong(),
                        booking.getNguoiDung().getUserName(),
                        booking.getNguoiDung().getPicture(),
                        booking.getChiTietDatPhongs().get(0).getPhong().getHomestay().getTenHomestay(),
                        booking.getChiTietDatPhongs().get(0).getPhong().getHomestay().getIdHomestay(),
                        booking.getChiTietDatPhongs().get(0).getNgayDen(),
                        booking.getChiTietDatPhongs().get(0).getNgayDi(),
                        bookingService.calculateTotalAmount(booking).intValue(),
                        booking.getTrangThai(),
                        booking.getNgayLap().toString()))
                .toList();

        return hostBookings;
    }
}
