package com.bookinghomestay.app.infrastructure.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.bookinghomestay.app.application.admin.promotion.dto.PromotionDataResponseDto;
import com.bookinghomestay.app.application.host.homestay.dto.HostHomestayList;
import com.bookinghomestay.app.application.host.promotion.dto.HostPromotionDataResponseDto;
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

    public static HostPromotionDataResponseDto toHostPromotionDataDto(KhuyenMai khuyenMai, String title,
            List<HostHomestayList> homestays) {
        HostPromotionDataResponseDto dto = new HostPromotionDataResponseDto();
        dto.setCode(khuyenMai.getMaKM());
        dto.setId(khuyenMai.getMaKM());
        dto.setTitle(title);
        dto.setDescription(khuyenMai.getNoiDung());
        dto.setType(khuyenMai.getLoaiChietKhau());
        dto.setValue(khuyenMai.getChietKhau() != null ? khuyenMai.getChietKhau().intValue() : 0);
        dto.setUsageLimit(khuyenMai.getSoLuong() != null ? khuyenMai.getSoLuong().intValue() : 0);
        dto.setUsageCount(khuyenMai.getHoaDons() != null ? khuyenMai.getHoaDons().size() : 0);
        dto.setMinBookingAmount(khuyenMai.getToiThieu() != null ? khuyenMai.getToiThieu().intValue() : 0);
        dto.setStartDate(khuyenMai.getNgayBatDau() != null ? khuyenMai.getNgayBatDau().toLocalDate() : null);
        dto.setEndDate(khuyenMai.getNgayKetThuc() != null ? khuyenMai.getNgayKetThuc().toLocalDate() : null);
        dto.setStatus(khuyenMai.getTrangThai());
        dto.setBookedTimes(khuyenMai.getSoDemToiThieu() != null ? khuyenMai.getSoDemToiThieu().intValue() : 0);
        dto.setMinNights(khuyenMai.getSoDemToiThieu() != null ? khuyenMai.getSoDemToiThieu().intValue() : 0);
        dto.setCreatedBy(khuyenMai.getNguoiTao() != null && khuyenMai.getNguoiTao().getLastName() != null
                ? khuyenMai.getNguoiTao().getLastName()
                : "");
        dto.setCreatedDate(khuyenMai.getNgayTao() != null ? khuyenMai.getNgayTao().toLocalDate() : null);
        dto.setForNewCustomer(khuyenMai.isChiApDungChoKhachMoi());
        dto.setImage(khuyenMai.getHinhAnh());
        dto.setHomestays(homestays);
        return dto;
    }
}
