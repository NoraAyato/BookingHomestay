package com.bookinghomestay.app.application.amenities.query;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.amenities.dto.amenities.AmenitiesResponseDto;
import com.bookinghomestay.app.domain.model.TienNghi;
import com.bookinghomestay.app.domain.repository.ITienNghiRepository;
import com.bookinghomestay.app.infrastructure.mapper.AmenitiesMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QueryAllAmenitiesHandler {
    private final ITienNghiRepository tienNghiRepository;

    public List<AmenitiesResponseDto> handle() {
        List<TienNghi> tienNghis = tienNghiRepository.getAll();

        return tienNghis.stream()
                .map(AmenitiesMapper::toDto)
                .toList();
    }
}
