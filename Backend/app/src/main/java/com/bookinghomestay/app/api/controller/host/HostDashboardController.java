package com.bookinghomestay.app.api.controller.host;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.application.admin.dashboard.dto.DashboardRevenueDto;
import com.bookinghomestay.app.application.host.dashboard.dto.HostDashBoardStatsDto;
import com.bookinghomestay.app.application.host.dashboard.dto.HostDashboardRevenueDto;
import com.bookinghomestay.app.application.host.dashboard.dto.HostRecentBookingResponseDto;
import com.bookinghomestay.app.application.host.dashboard.query.GetHostRecentBookingHandler;
import com.bookinghomestay.app.application.host.dashboard.query.GetHostRevenueQueryHandler;
import com.bookinghomestay.app.application.host.dashboard.query.GetHostStatsDashBoardQuey;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/host/dashboard")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('Admin') or hasRole('Host')")
public class HostDashboardController {
    private final GetHostStatsDashBoardQuey getHostStatsDashBoardQuey;
    private final GetHostRevenueQueryHandler getRevenueQueryHandler;
    private final GetHostRecentBookingHandler getHostRecentBookingHandler;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<HostDashBoardStatsDto>> getStats(
            @RequestParam(required = false, defaultValue = "7") Integer period) {
        String hostId = SecurityUtils.getCurrentUserId();
        var stats = getHostStatsDashBoardQuey.handle(hostId, period);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thống kê dashboard host thành công", stats));
    }

    @GetMapping("/revenue-trend")
    public ResponseEntity<ApiResponse<List<HostDashboardRevenueDto>>> getRevenue(
            @RequestParam(required = false, defaultValue = "6") Integer period) {
        String hostId = SecurityUtils.getCurrentUserId();
        List<HostDashboardRevenueDto> revenueTrend = getRevenueQueryHandler.handle(period, hostId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy doanh thu thành công", revenueTrend));
    }

    @GetMapping("/recent-bookings")
    public ResponseEntity<ApiResponse<List<HostRecentBookingResponseDto>>> getRecentBookings() {
        String hostId = SecurityUtils.getCurrentUserId();
        var result = getHostRecentBookingHandler.handle(hostId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy đặt phòng gần đây thành công", result));
    }

}
