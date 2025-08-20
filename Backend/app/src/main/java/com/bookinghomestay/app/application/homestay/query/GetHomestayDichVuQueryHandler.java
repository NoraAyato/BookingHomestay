package com.bookinghomestay.app.application.homestay.query;

import com.bookinghomestay.app.api.dto.homestay.HomestayDichVuResponseDto;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.service.HomestayDomainService;
import com.bookinghomestay.app.infrastructure.mapper.HomestayMapper;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetHomestayDichVuQueryHandler {

        private final IHomestayRepository homestayRepository;
        private final HomestayDomainService homestayDomainService;

        @Transactional
        public HomestayDichVuResponseDto handle(GetHomestayDichVuQuery query) {
                Homestay homestay = homestayRepository.findById(query.getHomestayId())
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy homestay"));

                homestayDomainService.validateHomestay(homestay);

                return HomestayMapper.toHomestayDichVuResponseDto(homestay);
        }
}
