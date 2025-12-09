package com.bookinghomestay.app.application.admin.booking.query;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.booking.dto.BookingDataResponseDto;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.common.util.PaginationUtil;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.service.BookingService;
import com.bookinghomestay.app.infrastructure.mapper.BookingMapper;

import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetBookingDataQueryHandler {
        private final IBookingRepository bookingRepository;
        private final BookingService bookingService;

        public PageResponse<BookingDataResponseDto> handle(GetBookingDataQuery query) {
                // Lấy tất cả booking
                List<PhieuDatPhong> allBookings = bookingRepository.findAll();

                // BƯỚC 1: Filter trước
                List<PhieuDatPhong> filteredBookings = allBookings.stream()
                                // Filter theo status (không phân biệt hoa thường)
                                .filter(booking -> query.getStatus() == null || query.getStatus().trim().isEmpty()
                                                || booking.getTrangThai().equalsIgnoreCase(query.getStatus()))
                                // Filter theo startDate
                                .filter(booking -> query.getStartDate() == null
                                                || !booking.getNgayLap().toLocalDate().isBefore(query.getStartDate()))
                                // Filter theo endDate
                                .filter(booking -> query.getEndDate() == null
                                                || !booking.getNgayLap().toLocalDate().isAfter(query.getEndDate()))
                                // Filter theo keyword
                                .filter(booking -> bookingService.matchesKeyword(booking, query.getKeyword()))
                                // Sắp xếp theo ngày lập giảm dần
                                .sorted(Comparator.comparing(PhieuDatPhong::getNgayLap).reversed())
                                .collect(Collectors.toList());

                // BƯỚC 2: Tính total sau khi filter
                int totalElements = filteredBookings.size();

                // BƯỚC 3: Phân trang (page bắt đầu từ 1)
                List<PhieuDatPhong> pagedBookings = PaginationUtil.paginate(filteredBookings, query.getPage(),
                                query.getSize());

                // BƯỚC 4: Map sang DTO
                List<BookingDataResponseDto> bookingDtos = pagedBookings.stream()
                                .map(bk -> {
                                        return BookingMapper.toBookingDataResponse(bk,
                                                        bookingService.calculateTotalAmount(bk));
                                })
                                .collect(Collectors.toList());

                // Tạo PageResponse
                PageResponse<BookingDataResponseDto> response = new PageResponse<>();
                response.setItems(bookingDtos);
                response.setTotal(totalElements);
                response.setPage(query.getPage());
                response.setLimit(query.getSize());

                return response;
        }
}
