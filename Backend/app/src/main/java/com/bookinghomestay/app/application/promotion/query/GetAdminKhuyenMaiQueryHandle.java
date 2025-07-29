package com.bookinghomestay.app.application.promotion.query;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.api.dto.promotion.PromotionResponeDto;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAdminKhuyenMaiQueryHandle {

    private final IKhuyenMaiRepository khuyenMaiRepository;

    public List<PromotionResponeDto> handle() {
        try {
            List<KhuyenMai> khuyenMais = khuyenMaiRepository.getAdminKm();
            if (khuyenMais == null)
                return List.of();
            return khuyenMais.stream().map(this::toDTO).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy danh sách khuyến mãi", e);
        }
    }

    private PromotionResponeDto toDTO(KhuyenMai khuyenMai) {
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