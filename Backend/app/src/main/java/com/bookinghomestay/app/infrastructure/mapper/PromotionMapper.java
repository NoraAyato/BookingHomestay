package com.bookinghomestay.app.infrastructure.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.bookinghomestay.app.application.promotion.dto.AvailablePromotionResponseDto;
import com.bookinghomestay.app.application.promotion.dto.PromotionResponeDto;
import com.bookinghomestay.app.domain.model.KhuyenMai;

public class PromotionMapper {

    public static PromotionResponeDto toDto(KhuyenMai khuyenMai) {
        return new PromotionResponeDto(
                khuyenMai.getMaKM(),
                khuyenMai.getNoiDung(),
                khuyenMai.getNgayBatDau(),
                khuyenMai.getNgayKetThuc(),
                khuyenMai.getChietKhau(),
                khuyenMai.getLoaiChietKhau(),
                khuyenMai.getSoDemToiThieu(),
                khuyenMai.getSoNgayDatTruoc(),
                khuyenMai.getHinhAnh(),
                khuyenMai.isChiApDungChoKhachMoi(),
                khuyenMai.isApDungChoTatCaPhong(),
                khuyenMai.getTrangThai(),
                khuyenMai.getSoLuong(),
                khuyenMai.getNgayTao());
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

    public static List<PromotionResponeDto> toDtoList(List<KhuyenMai> khuyenMais) {
        return khuyenMais.stream()
                .map(PromotionMapper::toDto)
                .collect(Collectors.toList());
    }
}
