package com.bookinghomestay.app.application.admin.dashboard.query;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.dashboard.dto.DashboardAreasDto;
import com.bookinghomestay.app.domain.repository.IKhuVucRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAreasInfoQueryHandler {
        private final IKhuVucRepository khuVucRepository;

        public List<DashboardAreasDto> handle() {
                var areasInfo = khuVucRepository.getAllByHomestayCout(5);
                List<DashboardAreasDto> result = areasInfo.stream()
                                .map(area -> DashboardAreasDto.builder()
                                                .location(area.getTenKv())
                                                .homestayCount(area.getHomestays() != null
                                                                ? String.valueOf(area.getHomestays().size())
                                                                : "0")
                                                .build())
                                .toList();
                return result;
        }
}
