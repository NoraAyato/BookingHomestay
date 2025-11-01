package com.bookinghomestay.app.application.booking.query;

import com.bookinghomestay.app.api.dto.booking.BookingDetailResponseDto;
import com.bookinghomestay.app.api.dto.booking.BookingResponseDto;
import com.bookinghomestay.app.domain.exception.ResourceNotFoundException;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.service.BookingService;
import com.bookinghomestay.app.infrastructure.mapper.BookingMapper;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetBookingDetailQueryHandler {
    private final IBookingRepository bookingRepository;
    private final BookingService bookingDomainService;

    public BookingResponseDto handle(GetBookingDetailQuery query) {
        var bookingOpt = bookingRepository.findById(query.getBookingId());
        if (bookingOpt.isEmpty()) {
            throw new ResourceNotFoundException(
                    "Booking not found with ID: " + query.getBookingId());
        }
        PhieuDatPhong booking = bookingOpt.get();
        BigDecimal tongTien = bookingDomainService.calculateTotalAmount(booking);
        return BookingMapper.toBookingResponseDto(booking, tongTien);
    }
}