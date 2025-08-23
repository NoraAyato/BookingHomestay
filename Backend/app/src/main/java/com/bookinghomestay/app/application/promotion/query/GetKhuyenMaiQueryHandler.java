package com.bookinghomestay.app.application.promotion.query;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.api.dto.promotion.PromotionResponeDto;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;
import com.bookinghomestay.app.infrastructure.mapper.PromotionMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class GetKhuyenMaiQueryHandler {
    private final IKhuyenMaiRepository khuyenMaiRepository;

    public PromotionResponeDto handle(String kmId) {
        KhuyenMai khuyenMai = khuyenMaiRepository.getKhuyenMaiById(kmId)
                .orElseThrow(() -> new com.bookinghomestay.app.domain.exception.ResourceNotFoundException(
                        "Không tìm thấy khuyến mãi với ID: " + kmId));
        return PromotionMapper.toDto(khuyenMai);
    }
}
