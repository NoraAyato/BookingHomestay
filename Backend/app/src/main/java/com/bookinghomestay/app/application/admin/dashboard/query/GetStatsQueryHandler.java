package com.bookinghomestay.app.application.admin.dashboard.query;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.dashboard.dto.DashboardStatDto;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.BookingService;
import com.bookinghomestay.app.domain.service.HomestayService;
import com.bookinghomestay.app.domain.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetStatsQueryHandler {
    private final IBookingRepository bookingRepository;
    private final IHomestayRepository homestayRepository;
    private final IUserRepository userRepository;
    private final UserService userService;
    private final BookingService bookingService;
    private final HomestayService homestayService;

    public List<DashboardStatDto> handler(Integer period) {
        // Default 7 days if not provided
        int days = (period != null && period > 0) ? period : 7;

        LocalDateTime currentEnd = LocalDateTime.now();
        LocalDateTime currentStart = currentEnd.minusDays(days);
        LocalDateTime previousStart = currentStart.minusDays(days);

        // Calculate stats for current period
        BigDecimal currentRevenue = bookingService.calculateRevenue(bookingRepository.findAllWithHoaDonAndThanhToan(),
                currentStart, currentEnd);
        long currentBookings = bookingService.countBookings(bookingRepository.findAllWithHoaDonAndThanhToan(),
                currentStart, currentEnd);
        long activeHomestays = homestayService.countActiveHomestays(homestayRepository.getAllActiveHomestay());
        long currentUsers = userService.countUsers(userRepository.findAll(), currentStart, currentEnd);

        // Calculate stats for previous period
        BigDecimal previousRevenue = bookingService.calculateRevenue(bookingRepository.findAllWithHoaDonAndThanhToan(),
                previousStart, currentStart);
        long previousBookings = bookingService.countBookings(bookingRepository.findAllWithHoaDonAndThanhToan(),
                previousStart, currentStart);
        long previousUsers = userService.countUsers(userRepository.findAll(), previousStart, currentStart);

        return Arrays.asList(
                DashboardStatDto.builder()
                        .title("Doanh thu")
                        .value(formatCurrency(currentRevenue))
                        .change(calculateChangePercent(currentRevenue, previousRevenue))
                        .trend(getDirection(currentRevenue, previousRevenue))
                        .build(),

                DashboardStatDto.builder()
                        .title("Đặt phòng")
                        .value(String.valueOf(currentBookings))
                        .change(calculateChangePercent(currentBookings, previousBookings))
                        .trend(getDirection(currentBookings, previousBookings))
                        .build(),

                DashboardStatDto.builder()
                        .title("Homestay hoạt động")
                        .value(String.valueOf(activeHomestays))
                        .change("+0.0%")
                        .trend("neutral")
                        .build(),

                DashboardStatDto.builder()
                        .title("Người dùng mới")
                        .value(String.valueOf(currentUsers))
                        .change(calculateChangePercent(currentUsers, previousUsers))
                        .trend(getDirection(currentUsers, previousUsers))
                        .build());
    }

    private String calculateChangePercent(BigDecimal current, BigDecimal previous) {
        if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
            return "+0.0%";
        }
        BigDecimal change = current.subtract(previous)
                .divide(previous, 3, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));
        return String.format("%+.1f%%", change);
    }

    private String calculateChangePercent(long current, long previous) {
        return calculateChangePercent(
                new BigDecimal(current),
                new BigDecimal(previous));
    }

    private String getDirection(BigDecimal current, BigDecimal previous) {
        if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
            return "neutral";
        }
        int comparison = current.compareTo(previous);
        if (comparison > 0)
            return "up";
        if (comparison < 0)
            return "down";
        return "neutral";
    }

    private String getDirection(long current, long previous) {
        if (current > previous)
            return "up";
        if (current < previous)
            return "down";
        return "neutral";
    }

    private String formatCurrency(BigDecimal amount) {
        if (amount == null)
            return "0";
        return String.format("%,.0f", amount);
    }
}
