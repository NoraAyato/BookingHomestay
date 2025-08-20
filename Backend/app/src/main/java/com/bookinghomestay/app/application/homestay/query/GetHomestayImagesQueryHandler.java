package com.bookinghomestay.app.application.homestay.query;

import com.bookinghomestay.app.api.dto.homestay.HomestayImageResponseDto;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.infrastructure.mapper.HomestayMapper;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetHomestayImagesQueryHandler {

        private final IHomestayRepository homestayRepository;

        @Transactional
        public HomestayImageResponseDto handle(GetHomestayImagesQuery query) {
                Homestay homestay = homestayRepository.findById(query.getHomestayId())
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy homestay"));

                return HomestayMapper.toHomestayImageResponseDto(homestay);
        }
}
