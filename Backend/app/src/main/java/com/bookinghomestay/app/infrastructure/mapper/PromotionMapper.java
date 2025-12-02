package com.bookinghomestay.app.infrastructure.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.bookinghomestay.app.application.promotion.dto.AvailablePromotionResponseDto;
import com.bookinghomestay.app.application.promotion.dto.MyPromotionResponeDto;

import com.bookinghomestay.app.domain.model.KhuyenMai;

public class PromotionMapper {

    public static MyPromotionResponeDto toDto(KhuyenMai khuyenMai) {
        return null;
    }

    public static AvailablePromotionResponseDto toAvailableDto(KhuyenMai khuyenMai, String title) {
        return new AvailablePromotionResponseDto(
                khuyenMai.getMaKM(),
                title,
                khuyenMai.getNoiDung(),
                khuyenMai.getLoaiChietKhau(),
                khuyenMai.getChietKhau().doubleValue(),
                khuyenMai.getMaKM(),
                khuyenMai.getHinhAnh(),
                khuyenMai.getToiThieu(),
                khuyenMai.getNgayKetThuc().toString());
    }

    public static MyPromotionResponeDto toMyPromotionDto(KhuyenMai khuyenMai, String title) {
        return new MyPromotionResponeDto(
                khuyenMai.getMaKM(),
                title,
                khuyenMai.getNoiDung(),
                khuyenMai.getNgayKetThuc().toString(),
                khuyenMai.getHinhAnh());
    }
}
