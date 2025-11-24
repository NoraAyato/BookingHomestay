package com.bookinghomestay.app.api.controller.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.application.admin.dashboard.dto.DashboardAreasDto;
import com.bookinghomestay.app.application.admin.dashboard.dto.DashboardBookingStatusDto;
import com.bookinghomestay.app.application.admin.dashboard.dto.DashboardNewsDto;
import com.bookinghomestay.app.application.admin.dashboard.dto.DashboardPromotionDto;
import com.bookinghomestay.app.application.admin.dashboard.dto.DashboardRevenueDto;
import com.bookinghomestay.app.application.admin.dashboard.dto.DashboardStatDto;
import com.bookinghomestay.app.application.admin.dashboard.query.GetAreasInfoQueryHandler;
import com.bookinghomestay.app.application.admin.dashboard.query.GetBookingStatusQueryHandler;
import com.bookinghomestay.app.application.admin.dashboard.query.GetNewsInfoQueryHandler;
import com.bookinghomestay.app.application.admin.dashboard.query.GetPromotionInfoQueryHandler;
import com.bookinghomestay.app.application.admin.dashboard.query.GetRevenueQueryHandler;
import com.bookinghomestay.app.application.admin.dashboard.query.GetStatsQueryHandler;
import com.bookinghomestay.app.common.response.ApiResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('Admin')")
public class DashBoardController {
    private final GetStatsQueryHandler getStatsQueryHandler;
    private final GetRevenueQueryHandler getRevenueQueryHandler;
    private final GetBookingStatusQueryHandler getBookingStatusQueryHandler;
    private final GetAreasInfoQueryHandler getAreasInfoQueryHandler;
    private final GetPromotionInfoQueryHandler getPromotionsInfoQueryHandler;
    private final GetNewsInfoQueryHandler getNewsInfoQueryHandler;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<List<DashboardStatDto>>> getStats(
            @RequestParam(required = false, defaultValue = "7") Integer period) {
        List<DashboardStatDto> stats = getStatsQueryHandler.handler(period);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thống kê thành công", stats));
    }

    @GetMapping("/revenue-trend")
    public ResponseEntity<ApiResponse<List<DashboardRevenueDto>>> getRevenue(
            @RequestParam(required = false, defaultValue = "6") Integer period) {
        List<DashboardRevenueDto> revenueTrend = getRevenueQueryHandler.handle(period);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy doanh thu thành công", revenueTrend));
    }

    @GetMapping("/booking-status")
    public ResponseEntity<ApiResponse<List<DashboardBookingStatusDto>>> getBookingStatus(
            @RequestParam(required = false, defaultValue = "7") Integer period) {
        List<DashboardBookingStatusDto> bookingStatus = getBookingStatusQueryHandler.handle(period);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy trạng thái đặt phòng thành công", bookingStatus));
    }

    @GetMapping("/areas")
    public ResponseEntity<ApiResponse<List<DashboardAreasDto>>> getAreasInfo() {
        List<DashboardAreasDto> areas = getAreasInfoQueryHandler.handle();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin khu vực thành công", areas));
    }

    @GetMapping("/promotions")
    public ResponseEntity<ApiResponse<List<DashboardPromotionDto>>> getPromotions() {
        List<DashboardPromotionDto> promotions = getPromotionsInfoQueryHandler.handle();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin khuyễn mãi thành công", promotions));
    }

    @GetMapping("/news")
    public ResponseEntity<ApiResponse<List<DashboardNewsDto>>> getNews() {
        List<DashboardNewsDto> news = getNewsInfoQueryHandler.handle();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin tin tức thành công", news));
    }
}
