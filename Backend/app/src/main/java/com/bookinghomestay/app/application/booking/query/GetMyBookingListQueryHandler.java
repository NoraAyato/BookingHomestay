package com.bookinghomestay.app.application.booking.query;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.booking.dto.booking.BookingResponseDto;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.service.BookingService;
import com.bookinghomestay.app.infrastructure.mapper.BookingMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetMyBookingListQueryHandler {
    private final IBookingRepository bookingRepository;
    private final BookingService bookingDomainService;

    public PageResponse<BookingResponseDto> handle(GetBookingListQuery query) {
        List<PhieuDatPhong> allBookings = bookingRepository.findByUserId(query.getUserId());
        int total = allBookings.size();
        int page = query.getPage();
        int limit = query.getLimit();
        List<BookingResponseDto> pagedBookings = allBookings.stream()
                .sorted((b1, b2) -> b2.getNgayLap().compareTo(b1.getNgayLap()))
                .skip((long) (query.getPage() - 1) * query.getLimit())
                .limit(query.getLimit())
                .map(booking -> {
                    boolean isCancelable = bookingDomainService.isCancelableBooking(booking);
                    var tongTien = bookingDomainService.calculateTotalAmount(booking);
                    boolean isReviewable = bookingDomainService.isReviewed(booking, query.getUserId());
                    if (booking.getTrangThai().equals("Booked")) {
                        var paidPrice = bookingDomainService.calculateRoomDepositAmount(booking);
                        BigDecimal haveToPayPrice = tongTien.subtract(paidPrice != null ? paidPrice : BigDecimal.ZERO);
                        return BookingMapper.toBookingResponseDto(booking, tongTien, haveToPayPrice,isCancelable, isReviewable);
                    } else if (booking.getTrangThai().equals("Pending")) {
                        var paidPrice = bookingDomainService.calculateRoomDepositAmount(booking);
                        return BookingMapper.toBookingResponseDto(booking, tongTien, paidPrice,isCancelable, isReviewable);
                    }
                    return BookingMapper.toBookingResponseDto(booking, tongTien, null,isCancelable, isReviewable);
                })
                .collect(Collectors.toList());

        PageResponse<BookingResponseDto> response = new PageResponse<>();
        response.setItems(pagedBookings);
        response.setTotal(total);
        response.setPage(page);
        response.setLimit(limit);
        return response;
    }
}
