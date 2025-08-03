package com.bookinghomestay.app.application.promotion.query;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.api.dto.promotion.PromotionResponeDto;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;
import com.bookinghomestay.app.infrastructure.mapper.PromotionMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAdminKhuyenMaiQueryHandle {

    private final IKhuyenMaiRepository khuyenMaiRepository;

    public List<PromotionResponeDto> handle() {
        try {
            List<KhuyenMai> khuyenMais = khuyenMaiRepository.getAdminKm();
            if (khuyenMais == null) {
                return List.of();
            }
            return khuyenMais.stream()
                    .map(PromotionMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy danh sách khuyến mãi", e);
        }
    }
}