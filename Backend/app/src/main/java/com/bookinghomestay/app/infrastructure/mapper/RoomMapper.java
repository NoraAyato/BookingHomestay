package com.bookinghomestay.app.infrastructure.mapper;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.tomcat.util.http.parser.Host;

import com.bookinghomestay.app.application.homestay.dto.RoomAvailabilityDto;
import com.bookinghomestay.app.application.host.amenities.dto.HostAmenitiesDataResponseDto;
import com.bookinghomestay.app.application.host.room.dto.HostRoomDataResponseDto;
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

    public static HostRoomDataResponseDto toHostRoomDataResponseDto(Phong phong, List<String> images,
            List<HostAmenitiesDataResponseDto> amenities) {
        HostRoomDataResponseDto dto = new HostRoomDataResponseDto();
        dto.setId(phong.getMaPhong());
        dto.setName(phong.getTenPhong());
        dto.setHomestayId(phong.getHomestay().getIdHomestay());
        dto.setHomestayName(phong.getHomestay().getTenHomestay());
        dto.setRoomType(phong.getLoaiPhong().getTenLoai());
        dto.setRoomTypeId(phong.getLoaiPhong().getIdLoai());
        dto.setCapacity(phong.getSoNguoi());
        dto.setStatus(phong.getTrangThai());
        dto.setPrice(phong.getDonGia() != null ? phong.getDonGia().intValue() : 0);
        dto.setImages(images);
        dto.setAmenities(amenities);
        return dto;
    }
}