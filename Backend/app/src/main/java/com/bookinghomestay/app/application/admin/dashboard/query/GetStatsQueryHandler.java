package com.bookinghomestay.app.application.admin.dashboard.query;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.dashboard.dto.DashboardStatDto;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetStatsQueryHandler {
    private final IBookingRepository bookingRepository;
    private final IHomestayRepository homestayRepository;
    private final IUserRepository userRepository;

    public List<DashboardStatDto> handler(Integer period) {
        // Default 7 days if not provided
        int days = (period != null && period > 0) ? period : 7;

        LocalDateTime currentEnd = LocalDateTime.now();
        LocalDateTime currentStart = currentEnd.minusDays(days);
        LocalDateTime previousStart = currentStart.minusDays(days);

        // Calculate stats for current period
        BigDecimal currentRevenue = calculateRevenue(currentStart, currentEnd);
        long currentBookings = countBookings(currentStart, currentEnd);
        long activeHomestays = countActiveHomestays();
        long currentUsers = countUsers(currentStart, currentEnd);

        // Calculate stats for previous period
        BigDecimal previousRevenue = calculateRevenue(previousStart, currentStart);
        long previousBookings = countBookings(previousStart, currentStart);
        long previousUsers = countUsers(previousStart, currentStart);

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

    private BigDecimal calculateRevenue(LocalDateTime start, LocalDateTime end) {

        var result = bookingRepository.findAllWithHoaDonAndThanhToan().stream()
                .filter(b -> b.getNgayLap() != null)
                .filter(b -> !b.getNgayLap().isBefore(start) && b.getNgayLap().isBefore(end))
                .filter(b -> "Booked".equals(b.getTrangThai()) || "Completed".equals(b.getTrangThai()))
                .filter(b -> b.getHoadon() != null && b.getHoadon().getThanhToans() != null)
                .flatMap(b -> b.getHoadon().getThanhToans().stream()
                        .filter(t -> "SUCCESS".equalsIgnoreCase(t.getTrangThai()))
                        .map(t -> t.getSoTien()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        System.out.println("[DEBUG] Revenue result: " + result);
        return result;
    }

    private long countBookings(LocalDateTime start, LocalDateTime end) {
        return bookingRepository.findAll().stream()
                .filter(b -> b.getNgayLap() != null)
                .filter(b -> b.getTrangThai().equalsIgnoreCase("booked")
                        || b.getTrangThai().equalsIgnoreCase("completed"))
                .filter(b -> !b.getNgayLap().isBefore(start) && b.getNgayLap().isBefore(end))
                .count();
    }

    private long countActiveHomestays() {
        return homestayRepository.getAllActiveHomestay().stream()
                .count();
    }

    private long countUsers(LocalDateTime start, LocalDateTime end) {
        return userRepository.findAll().stream()
                .filter(u -> u.getCreatedAt() != null)
                .filter(u -> !u.getCreatedAt().isBefore(start) && u.getCreatedAt().isBefore(end))
                .count();
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
