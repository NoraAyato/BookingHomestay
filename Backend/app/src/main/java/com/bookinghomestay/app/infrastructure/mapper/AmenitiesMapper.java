package com.bookinghomestay.app.infrastructure.mapper;

import com.bookinghomestay.app.application.amenities.dto.amenities.AmenitiesResponseDto;
import com.bookinghomestay.app.domain.model.TienNghi;

public class AmenitiesMapper {
    public static AmenitiesResponseDto toDto(TienNghi tienNghi) {
        AmenitiesResponseDto dto = new AmenitiesResponseDto();
        dto.setId(tienNghi.getMaTienNghi());
        dto.setName(tienNghi.getTenTienNghi());
        dto.setDescription(tienNghi.getMoTa());
        return dto;
    }
}
