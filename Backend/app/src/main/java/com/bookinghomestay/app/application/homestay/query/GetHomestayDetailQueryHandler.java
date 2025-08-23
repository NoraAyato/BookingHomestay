// file: GetHomestayDetailQueryHandler.java
package com.bookinghomestay.app.application.homestay.query;

import com.bookinghomestay.app.api.dto.homestay.HomestayDetailResponseDto;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.repository.IDanhGiaRepository;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.service.HomestayDomainService;
import com.bookinghomestay.app.infrastructure.mapper.HomestayMapper;
import com.bookinghomestay.app.domain.exception.ResourceNotFoundException;
import com.bookinghomestay.app.domain.exception.BusinessException;

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
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Không tìm thấy homestay với mã: " + query.getHomestayId()));

                // Kiểm tra tính hợp lệ của homestay
                if (!homestayDomainService.validateHomestay(homestay)) {
                        throw new BusinessException("Homestay không hợp lệ hoặc thiếu thông tin bắt buộc");
                }

                // Lấy thông tin đánh giá
                int tongDanhGia = danhGiaRepository.countByHomestayId(query.getHomestayId());
                Double diemTB = danhGiaRepository.averageHaiLongByHomestayId(query.getHomestayId());
                double diemTrungBinh = diemTB != null ? diemTB : 0.0;

                // Chuyển đổi sang DTO
                return HomestayMapper.toHomestayDetailResponseDto(homestay, tongDanhGia, diemTrungBinh);
        }
}
