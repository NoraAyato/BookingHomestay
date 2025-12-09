package com.bookinghomestay.app.infrastructure.mapper;

import com.bookinghomestay.app.application.admin.service.dto.ServiceDataResponseDto;
import com.bookinghomestay.app.domain.model.DichVuHs;

public class ServiceMapper {
    public ServiceDataResponseDto toDataResponse(DichVuHs dichVuHs) {
        ServiceDataResponseDto dto = new ServiceDataResponseDto();
        dto.setId(dichVuHs.getMaDichVuHomestay());
        dto.setName(dichVuHs.getTenDichVuHomestay());
        return dto;
    }
}
