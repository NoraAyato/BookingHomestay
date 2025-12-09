package com.bookinghomestay.app.api.controller.admin;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.application.admin.booking.dto.BookingDataResponseDto;
import com.bookinghomestay.app.application.admin.booking.dto.BookingStatsResponseDto;
import com.bookinghomestay.app.application.admin.booking.query.GetBookingDataQuery;
import com.bookinghomestay.app.application.admin.booking.query.GetBookingDataQueryHandler;
import com.bookinghomestay.app.application.admin.booking.query.GetBookingStatsQueryHandler;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.common.response.PageResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/admin/bookingmanager")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('Admin')")
public class BookingManagerController {
    // Booking management endpoints to be implemented
    private final GetBookingDataQueryHandler getBookingDataQueryHandler;
    private final GetBookingStatsQueryHandler getBookingStatsQueryHandler;

    @GetMapping()
    public ResponseEntity<ApiResponse<PageResponse<BookingDataResponseDto>>> getBookingData(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) String keyword) {

        PageResponse<BookingDataResponseDto> response = getBookingDataQueryHandler
                .handle(new GetBookingDataQuery(page, size, status, startDate, endDate, keyword));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy dữ liệu đặt phòng thành công", response));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<BookingStatsResponseDto>> getBookingStats() {
        BookingStatsResponseDto stats = getBookingStatsQueryHandler.handle();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thống kê đặt phòng thành công", stats));
    }

}
