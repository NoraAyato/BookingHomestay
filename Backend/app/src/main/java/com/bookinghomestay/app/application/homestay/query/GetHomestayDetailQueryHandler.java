// file: GetHomestayDetailQueryHandler.java
package com.bookinghomestay.app.application.homestay.query;

import com.bookinghomestay.app.api.dto.homestay.HomestayDetailResponseDto;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.repository.IDanhGiaRepository;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.service.HomestayDomainService;
import com.bookinghomestay.app.infrastructure.mapper.HomestayMapper;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetHomestayDetailQueryHandler {

        private final IHomestayRepository homestayRepository;
        private final IDanhGiaRepository danhGiaRepository;
        private final HomestayDomainService homestayDomainService;

        @Transactional
        public HomestayDetailResponseDto handle(GetHomestayDetailQuery query) {
                // Lấy thông tin homestay
                Homestay homestay = homestayRepository.findById(query.getHomestayId())
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy homestay"));

                // Kiểm tra tính hợp lệ của homestay
                if (!homestayDomainService.validateHomestay(homestay)) {
                        throw new RuntimeException("Homestay không hợp lệ");
                }

                // Lấy thông tin đánh giá
                int tongDanhGia = danhGiaRepository.countByHomestayId(query.getHomestayId());
                Double diemTB = danhGiaRepository.averageHaiLongByHomestayId(query.getHomestayId());
                double diemTrungBinh = diemTB != null ? diemTB : 0.0;

                // Chuyển đổi sang DTO
                return HomestayMapper.toHomestayDetailResponseDto(homestay, tongDanhGia, diemTrungBinh);
        }
}
