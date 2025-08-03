package com.bookinghomestay.app.infrastructure.mapper;

import com.bookinghomestay.app.api.dto.promotion.PromotionResponeDto;
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
    
}
