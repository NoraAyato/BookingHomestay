package com.bookinghomestay.app.application.booking.query;

import com.bookinghomestay.app.api.dto.booking.BookingDetailResponseDto;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.infrastructure.mapper.BookingMapper;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetBookingDetailQueryHandler {
    private final IBookingRepository bookingRepository;

    public BookingDetailResponseDto handle(GetBookingDetailQuery query) {

        var bookingOpt = bookingRepository.findById(query.getBookingId());
        if (bookingOpt.isEmpty()) {
            return null;
        }

        PhieuDatPhong booking = bookingOpt.get();

        return BookingMapper.toBookingDetailResponseDto(booking);
    }
}