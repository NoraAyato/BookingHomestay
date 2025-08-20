package com.bookinghomestay.app.application.booking.query;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.api.dto.booking.BookingListResponseDto;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.service.BookingDomainService;
import com.bookinghomestay.app.infrastructure.mapper.BookingMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetBookingListQueryHandler {
    private final IBookingRepository bookingRepository;
    private final BookingDomainService bookingDomainService;

    public List<BookingListResponseDto> handle(GetBookingListQuery query) {
        List<PhieuDatPhong> bookings = bookingRepository.findByUserId(query.getUserId());
        return bookings.stream()
                .sorted((b1, b2) -> b2.getNgayLap().compareTo(b1.getNgayLap()))
                .map(booking -> {
                    var tongTien = bookingDomainService.calculateTotalAmount(booking);
                    return BookingMapper.toBookingListResponseDto(booking, tongTien);
                })
                .collect(Collectors.toList());
    }
}
