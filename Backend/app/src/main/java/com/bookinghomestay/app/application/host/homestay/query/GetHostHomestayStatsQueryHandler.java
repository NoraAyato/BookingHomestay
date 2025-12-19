package com.bookinghomestay.app.application.host.homestay.query;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.host.homestay.dto.HostHomestayStatsResponseDto;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.service.HomestayService;

import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetHostHomestayStatsQueryHandler {
    private final IHomestayRepository homestayRepository;
    private final HomestayService homestayService;

    public HostHomestayStatsResponseDto handle(String hostId) {
        List<Homestay> homestays = homestayRepository.getHomestayByHostId(hostId);
        if (homestays != null && !homestays.isEmpty()) {
            int total = homestays.size();
            int active = (int) homestays.stream().filter(h -> h.getTrangThai().equalsIgnoreCase("Active")).count();
            int inactive = total - active;
            int totalRevenue = (int) homestays.stream().mapToDouble(homestayService::calculateRevenueByHomestay).sum();
            return new HostHomestayStatsResponseDto(total, active, inactive, totalRevenue);
        }
        return new HostHomestayStatsResponseDto(0, 0, 0, 0);
    }
}
