package com.bookinghomestay.app.infrastructure.mapper;

import com.bookinghomestay.app.application.policies.dto.PoliciesResponseDto;
import com.bookinghomestay.app.domain.model.ChinhSach;

public class PoliciesMapper {
    public static PoliciesResponseDto toPoliciesResponseDto(ChinhSach chinhSach) {
        if (chinhSach == null) {
            return null;
        }
        PoliciesResponseDto dto = new PoliciesResponseDto();
        dto.setCheckIn(chinhSach.getNhanPhong());
        dto.setCheckOut(chinhSach.getTraPhong());
        dto.setCancellation(chinhSach.getHuyPhong());
        dto.setMeals(chinhSach.getBuaAn());
        return dto;
    }
}
