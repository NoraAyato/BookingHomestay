package com.bookinghomestay.app.infrastructure.mapper;

import java.time.LocalDate;

import com.bookinghomestay.app.application.admin.reviews.dto.ReviewsDataResponseDto;
import com.bookinghomestay.app.application.homestay.dto.HomestayReviewResponseDto;
import com.bookinghomestay.app.application.reviews.dto.TopReviewResponseDto;
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

    public static TopReviewResponseDto toTopReviewResponseDto(String id,
            String name,
            String avatar,
            String location,
            String content,
            double rating,
            String homestay,
            LocalDate date,
            String image) {
        return new TopReviewResponseDto(id, name, avatar, location, content, rating, homestay, date, image);
    }

    public static ReviewsDataResponseDto toReviewData(DanhGia danhGia) {
        ReviewsDataResponseDto dto = new ReviewsDataResponseDto();
        dto.setId(danhGia.getIdDG());
        dto.setBookingId(danhGia.getPhieuDatPhong() != null ? danhGia.getPhieuDatPhong().getMaPDPhong() : null);
        dto.setImage(danhGia.getHinhAnh() != null ? danhGia.getHinhAnh() : null);
        dto.setGuestName(danhGia.getNguoiDung() != null ? danhGia.getNguoiDung().getUserName() : null);
        dto.setGuestAvatar(danhGia.getNguoiDung() != null ? danhGia.getNguoiDung().getPicture() : null);
        dto.setHomestayId(danhGia.getHomestay() != null ? danhGia.getHomestay().getIdHomestay() : null);
        dto.setHomestayName(danhGia.getHomestay() != null ? danhGia.getHomestay().getTenHomestay() : null);
        dto.setRating((danhGia.getSachSe() + danhGia.getTienIch() + danhGia.getDichVu()) / 3);
        dto.setContent(danhGia.getBinhLuan());
        dto.setDate(danhGia.getNgayDanhGia() != null ? danhGia.getNgayDanhGia().toLocalDate() : null);
        return dto;

    }
}