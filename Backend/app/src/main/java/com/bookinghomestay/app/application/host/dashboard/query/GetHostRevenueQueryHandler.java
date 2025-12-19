package com.bookinghomestay.app.application.host.dashboard.query;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import com.bookinghomestay.app.application.host.dashboard.dto.HostDashboardRevenueDto;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.BookingService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetHostRevenueQueryHandler {
    private final IBookingRepository bookingRepository;
    private final BookingService bookingService;
    private final IUserRepository userRepository;

    public List<HostDashboardRevenueDto> handle(Integer period, String hostId) {
        // Default 12 months if not provided
        int months = (period != null && period > 0) ? period : 12;
        User host = userRepository.findById(hostId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy host !"));
        // list all bookings of host
        List<PhieuDatPhong> allBookings = bookingService.findBookingByHostId(host.getUserId(),
                bookingRepository.findAllWithHoaDonAndThanhToan());
        LocalDateTime now = LocalDateTime.now();
        List<HostDashboardRevenueDto> result = new ArrayList<>();

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

            HostDashboardRevenueDto dto = new HostDashboardRevenueDto();
            dto.setMonth(getMonthName(targetMonth));
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
