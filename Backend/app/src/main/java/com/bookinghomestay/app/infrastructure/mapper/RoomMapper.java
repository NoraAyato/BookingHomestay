package com.bookinghomestay.app.infrastructure.mapper;

import java.math.BigDecimal;
import java.util.stream.Collectors;

import com.bookinghomestay.app.api.dto.homestay.RoomAvailabilityDto;
import com.bookinghomestay.app.domain.model.HinhAnhPhong;
import com.bookinghomestay.app.domain.model.Phong;

public class RoomMapper {
    public static RoomAvailabilityDto toRoomAvailabilityDto(Phong phong, boolean available, BigDecimal discountPrice) {
        return new RoomAvailabilityDto(
                phong.getMaPhong(),
                phong.getLoaiPhong().getMoTa(),
                phong.getTenPhong(),
                phong.getDonGia(),
                discountPrice,
                phong.getLoaiPhong().getTenLoai(),
                phong.getSoNguoi(),
                phong.getHinhAnhPhongs().stream().map(HinhAnhPhong::getUrlAnh).collect(Collectors.toList()),
                phong.getChiTietPhongs().stream().map(ct -> ct.getTienNghi().getTenTienNghi())
                        .collect(Collectors.toList()),
                available);
    }
}