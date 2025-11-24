package com.bookinghomestay.app.application.admin.dashboard.query;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.dashboard.dto.DashboardRevenueDto;
import com.bookinghomestay.app.domain.repository.IBookingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetRevenueQueryHandler {
    private final IBookingRepository bookingRepository;

    public List<DashboardRevenueDto> handle(Integer period) {
        // Default 12 months if not provided
        int months = (period != null && period > 0) ? period : 12;

        LocalDateTime now = LocalDateTime.now();
        List<DashboardRevenueDto> result = new ArrayList<>();

        // Get all bookings once with JOIN FETCH
        var allBookings = bookingRepository.findAllWithHoaDonAndThanhToan();

        // Calculate revenue for each month going backwards from current month
        for (int i = months - 1; i >= 0; i--) {
            YearMonth targetMonth = YearMonth.from(now.minusMonths(i));
            LocalDateTime monthStart = targetMonth.atDay(1).atStartOfDay();
            LocalDateTime monthEnd = targetMonth.atEndOfMonth().atTime(23, 59, 59);

            // Calculate revenue for this month
            BigDecimal monthRevenue = allBookings.stream()
                    .filter(b -> b.getNgayLap() != null)
                    .filter(b -> !b.getNgayLap().isBefore(monthStart) && b.getNgayLap().isBefore(monthEnd))
                    .filter(b -> "Booked".equals(b.getTrangThai()) || "Completed".equals(b.getTrangThai()))
                    .filter(b -> b.getHoadon() != null && b.getHoadon().getThanhToans() != null)
                    .flatMap(b -> b.getHoadon().getThanhToans().stream()
                            .filter(t -> "SUCCESS".equalsIgnoreCase(t.getTrangThai()))
                            .map(t -> t.getSoTien()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Count bookings for this month
            long monthBookings = allBookings.stream()
                    .filter(b -> b.getNgayLap() != null)
                    .filter(b -> !b.getNgayLap().isBefore(monthStart) && b.getNgayLap().isBefore(monthEnd))
                    .count();

            DashboardRevenueDto dto = new DashboardRevenueDto();
            dto.setName(getMonthName(targetMonth));
            dto.setRevenue(formatCurrency(monthRevenue));
            dto.setBookings(String.valueOf(monthBookings));
            result.add(dto);
        }

        return result;
    }

    private String getMonthName(YearMonth yearMonth) {
        String monthName = yearMonth.getMonth().getDisplayName(TextStyle.SHORT, new Locale("vi", "VN"));
        return monthName + " " + yearMonth.getYear();
    }

    private String formatCurrency(BigDecimal amount) {
        if (amount == null)
            return "0";
        return String.format("%,.0f", amount);
    }
}
