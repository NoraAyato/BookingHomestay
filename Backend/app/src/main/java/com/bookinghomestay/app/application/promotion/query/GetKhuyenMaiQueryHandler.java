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

public class GetKhuyenMaiQueryHandler {
    private final IKhuyenMaiRepository khuyenMaiRepository;

    public PromotionResponeDto handle(String kmId) {
        try {
            KhuyenMai khuyenMai = khuyenMaiRepository.getKhuyenMaiById(kmId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khuyến mãi với ID: " + kmId));
            return PromotionMapper.toDto(khuyenMai);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy khuyến mãi: " + e.getMessage(), e);
        }
    }
}
