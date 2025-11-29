package com.bookinghomestay.app.infrastructure.mapper;

import com.bookinghomestay.app.application.homestay.dto.HomestayReviewResponseDto;
import com.bookinghomestay.app.domain.model.DanhGia;

public class ReviewMapper {
    public static HomestayReviewResponseDto toResponseDto(DanhGia danhGia) {
        return HomestayReviewResponseDto.builder()
                .id(danhGia.getIdDG())
                .username(danhGia.getNguoiDung().getUserName())
                .userAvatar(danhGia.getNguoiDung().getPicture())
                .rating(String.valueOf(
                        (danhGia.getSachSe() + danhGia.getTienIch() + danhGia.getDichVu()) / 3))
                .comment(danhGia.getBinhLuan())
                .image(danhGia.getHinhAnh())
                .date(danhGia.getNgayDanhGia())
                .build();
    }
}