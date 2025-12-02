package com.bookinghomestay.app.infrastructure.mapper;

import com.bookinghomestay.app.application.admin.locationmanager.dto.LocationInfoResponseDto;
import com.bookinghomestay.app.domain.model.KhuVuc;

public class LocationMapper {
    public static LocationInfoResponseDto toLocationInfo(KhuVuc location, int bookingCount, int homestayCount) {
        return new LocationInfoResponseDto(
                location.getMaKv(),
                location.getTenKv(),
                location.getMota(),
                homestayCount,
                bookingCount,
                location.getTrangThai() != null ? location.getTrangThai() : "inactive",
                location.getHinhanh() != null ? location.getHinhanh() : "");
    }
}
