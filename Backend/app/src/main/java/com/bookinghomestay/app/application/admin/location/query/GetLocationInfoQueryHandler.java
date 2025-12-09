package com.bookinghomestay.app.application.admin.location.query;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.location.dto.LocationInfoResponseDto;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.domain.model.KhuVuc;
import com.bookinghomestay.app.domain.repository.IKhuVucRepository;
import com.bookinghomestay.app.domain.service.HomestayService;
import com.bookinghomestay.app.infrastructure.mapper.LocationMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetLocationInfoQueryHandler {
    private final IKhuVucRepository khuVucRepository;
    private final HomestayService homestayService;

    public PageResponse<LocationInfoResponseDto> handler(GetLocationInfoQuery query) {
        Pageable pageable = PageRequest.of(query.getPage() - 1, query.getSize());
        Page<KhuVuc> khuVucPage = khuVucRepository.findBySearch(query.getSearch(), pageable);

        List<LocationInfoResponseDto> dtos = khuVucPage.getContent().stream()
                .map(location -> {
                    int homestayCount = location.getHomestays() != null ? location.getHomestays().size() : 0;
                    int bookedHomestayCount = homestayService.countBookingByLocation(location);
                    return LocationMapper.toLocationInfo(location, bookedHomestayCount, homestayCount);
                })
                .toList();

        return new PageResponse<>(dtos, (int) khuVucPage.getTotalElements(), query.getPage(), query.getSize());
    }
}
