package com.bookinghomestay.app.api.controller.host;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.application.host.bookings.command.UpdateBookingCommandHandler;
import com.bookinghomestay.app.application.host.bookings.dto.HostBookingDataResponseDto;
import com.bookinghomestay.app.application.host.bookings.dto.HostBookingStatsDto;
import com.bookinghomestay.app.application.host.bookings.query.HostBookingDataQuery;
import com.bookinghomestay.app.application.host.bookings.query.HostBookingDataQueryHandler;
import com.bookinghomestay.app.application.host.bookings.query.HostGetBookingStatsQueryHandler;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/host/bookings")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('Admin') or hasRole('Host')")
public class HostBookingController {
    private final HostBookingDataQueryHandler getHostStatsDashBoardQuey;
    private final HostGetBookingStatsQueryHandler hostGetBookingStatsQueryHandler;
    private final UpdateBookingCommandHandler updateBookingCommandHandler;

    @GetMapping()
    public ResponseEntity<ApiResponse<PageResponse<HostBookingDataResponseDto>>> getData(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) String keyword) {
        String hostId = SecurityUtils.getCurrentUserId();
        var stats = getHostStatsDashBoardQuey
                .handle(new HostBookingDataQuery(hostId, keyword, page, size, status, startDate, endDate));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thống kê dashboard host thành công", stats));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<HostBookingStatsDto>> getStats() {
        String hostId = SecurityUtils.getCurrentUserId();
        var stats = hostGetBookingStatsQueryHandler.handle(hostId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thống kê dashboard host thành công", stats));
    }

    @PutMapping("{id}")
    public ResponseEntity<ApiResponse<Void>> updateBookings(@PathVariable String id) {
        String hostId = SecurityUtils.getCurrentUserId();
        updateBookingCommandHandler.handle(id, hostId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật booking thành công", null));
    }
}
