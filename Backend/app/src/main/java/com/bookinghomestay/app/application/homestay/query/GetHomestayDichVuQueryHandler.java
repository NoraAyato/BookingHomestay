package com.bookinghomestay.app.application.homestay.query;

import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.service.HomestayService;
import com.bookinghomestay.app.infrastructure.mapper.HomestayMapper;
import com.bookinghomestay.app.domain.exception.ResourceNotFoundException;
import com.bookinghomestay.app.application.homestay.dto.HomestayDichVuResponseDto;
import com.bookinghomestay.app.domain.exception.BusinessException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetHomestayDichVuQueryHandler {

        private final IHomestayRepository homestayRepository;
        private final HomestayService homestayDomainService;

        @Transactional
        public List<HomestayDichVuResponseDto> handle(GetHomestayDichVuQuery query) {
                Homestay homestay = homestayRepository.findById(query.getHomestayId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Không tìm thấy homestay với mã: " + query.getHomestayId()));

                if (!homestayDomainService.validateHomestay(homestay)) {
                        throw new BusinessException("Homestay không hợp lệ hoặc thiếu thông tin bắt buộc");
                }
                List<HomestayDichVuResponseDto> dichVuList = homestay.getDichVus().stream()
                                .map(dv -> HomestayMapper.toServiceDto(dv))
                                .toList();
                return dichVuList;
        }
}
