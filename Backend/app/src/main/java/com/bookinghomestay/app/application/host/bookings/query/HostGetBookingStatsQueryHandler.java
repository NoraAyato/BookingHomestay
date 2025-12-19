package com.bookinghomestay.app.application.host.bookings.query;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.booking.dto.BookingStatsResponseDto;
import com.bookinghomestay.app.application.host.bookings.dto.HostBookingStatsDto;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.BookingService;
import com.bookinghomestay.app.domain.service.HomestayService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HostGetBookingStatsQueryHandler {
    private final IBookingRepository bookingRepository;
    private final IUserRepository userRepository;
    private final BookingService bookingService;
    private final IHomestayRepository homestayRepository;
    private final HomestayService homestayService;

    public HostBookingStatsDto handle(String hostId) {
        User host = userRepository.findById(hostId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng !"));
        var booking = bookingService.findBookingByHostId(host.getUserId(),
                bookingRepository.findAll());
        var hostHomestays = homestayRepository.getAll().stream()
                .filter(homestay -> homestay.getNguoiDung().getUserId().equalsIgnoreCase(hostId))
                .toList();
        int total = booking.size();
        int pending = (int) booking.stream()
                .filter(b -> b.getTrangThai().equalsIgnoreCase("Pending"))
                .count();
        int booked = (int) booking.stream()
                .filter(b -> b.getTrangThai().equalsIgnoreCase("Booked"))
                .count();
        int cancelled = (int) booking.stream()
                .filter(b -> b.getTrangThai().equalsIgnoreCase("Cancelled"))
                .count();
        int completed = (int) booking.stream()
                .filter(b -> b.getTrangThai().equalsIgnoreCase("Completed"))
                .count();
        int totalRevenue = hostHomestays.stream()
                .mapToInt(homestay -> (int) homestayService.calculateRevenueByHomestay(homestay))
                .sum();
        return new HostBookingStatsDto(total, pending, booked, cancelled, completed, totalRevenue);
    }
}
