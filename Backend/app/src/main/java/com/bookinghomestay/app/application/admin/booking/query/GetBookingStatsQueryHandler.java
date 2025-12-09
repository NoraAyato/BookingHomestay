package com.bookinghomestay.app.application.admin.booking.query;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.booking.dto.BookingStatsResponseDto;
import com.bookinghomestay.app.domain.repository.IBookingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetBookingStatsQueryHandler {
    private final IBookingRepository bookingRepository;

    public BookingStatsResponseDto handle() {
        int total = bookingRepository.findAll().size();
        int pending = (int) bookingRepository.findAll().stream()
                .filter(booking -> booking.getTrangThai().equalsIgnoreCase("Pending"))
                .count();
        int booked = (int) bookingRepository.findAll().stream()
                .filter(booking -> booking.getTrangThai().equalsIgnoreCase("Booked"))
                .count();
        int cancelled = (int) bookingRepository.findAll().stream()
                .filter(booking -> booking.getTrangThai().equalsIgnoreCase("Cancelled"))
                .count();
        int completed = (int) bookingRepository.findAll().stream()
                .filter(booking -> booking.getTrangThai().equalsIgnoreCase("Completed"))
                .count();
        return new BookingStatsResponseDto(total, pending, booked, cancelled, completed);
    }
}
