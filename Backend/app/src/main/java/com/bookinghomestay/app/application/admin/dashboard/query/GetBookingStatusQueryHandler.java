package com.bookinghomestay.app.application.admin.dashboard.query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.dashboard.dto.DashboardBookingStatusDto;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.repository.IBookingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetBookingStatusQueryHandler {
    private final IBookingRepository bookingRepository;

    public List<DashboardBookingStatusDto> handle(Integer period) {
        int days = (period != null && period > 0) ? period : 7;
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(days);

        var allBookings = bookingRepository.findAll();

        List<DashboardBookingStatusDto> result = allBookings.stream()
                .filter(b -> b.getNgayLap() != null)
                .filter(b -> !b.getNgayLap().isBefore(startDate) && b.getNgayLap().isBefore(endDate))
                .collect(Collectors.groupingBy(PhieuDatPhong::getTrangThai, Collectors.counting()))
                .entrySet()
                .stream()
                .map(entry -> DashboardBookingStatusDto.builder()
                        .name(entry.getKey())
                        .value(String.valueOf(entry.getValue()))
                        .build())
                .collect(Collectors.toList());

        return result;
    }
}
