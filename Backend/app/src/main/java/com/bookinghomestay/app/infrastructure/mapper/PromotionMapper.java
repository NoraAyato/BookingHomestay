package com.bookinghomestay.app.infrastructure.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.bookinghomestay.app.application.admin.promotion.dto.PromotionDataResponseDto;
import com.bookinghomestay.app.application.promotion.dto.AvailablePromotionResponseDto;
import com.bookinghomestay.app.application.promotion.dto.MyPromotionResponeDto;

import com.bookinghomestay.app.domain.model.KhuyenMai;

public class PromotionMapper {

    public static MyPromotionResponeDto toDto(KhuyenMai khuyenMai) {
        return null;
    }

    public static PromotionDataResponseDto toPromotionDataDto(KhuyenMai khuyenMai, String title) {
        return new PromotionDataResponseDto(
                khuyenMai.getMaKM(),
                khuyenMai.getHinhAnh(),
                khuyenMai.getSoNgayDatTruoc() != null ? khuyenMai.getSoNgayDatTruoc().intValue() : 0,
                khuyenMai.getSoDemToiThieu() != null ? khuyenMai.getSoDemToiThieu().intValue() : 0,
                title,
                khuyenMai.getLoaiChietKhau(),
                khuyenMai.getChietKhau().doubleValue(),
                khuyenMai.getNoiDung(),
                khuyenMai.getTrangThai(),
                khuyenMai.getNgayBatDau().toLocalDate(),
                khuyenMai.getNgayKetThuc().toLocalDate(),
                khuyenMai.getSoLuong(),
                khuyenMai.getHoaDons().size() != 0 ? khuyenMai.getHoaDons().size() : 0,
                khuyenMai.getToiThieu() != null ? khuyenMai.getToiThieu().doubleValue() : 0,
                khuyenMai.getNguoiTao() != null && khuyenMai.getNguoiTao().getLastName() != null
                        ? khuyenMai.getNguoiTao().getLastName()
                        : "",
                khuyenMai.getNgayTao().toLocalDate(),
                khuyenMai.isChiApDungChoKhachMoi());
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
