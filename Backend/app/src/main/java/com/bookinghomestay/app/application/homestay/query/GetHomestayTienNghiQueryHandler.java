package com.bookinghomestay.app.application.homestay.query;

import com.bookinghomestay.app.application.homestay.dto.HomestayTienNghiResponseDto;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.service.HomestayService;
import com.bookinghomestay.app.infrastructure.mapper.HomestayMapper;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetHomestayTienNghiQueryHandler {

        private final IHomestayRepository homestayRepository;
        private final HomestayService homestayDomainService;

        @Transactional
        public HomestayTienNghiResponseDto handle(GetHomestayTienNghiQuery query) {
                Homestay homestay = homestayRepository.findById(query.getHomestayId())
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy homestay"));

                homestayDomainService.validateHomestay(homestay);

                return HomestayMapper.toHomestayTienNghiResponseDto(homestay);
        }
}
