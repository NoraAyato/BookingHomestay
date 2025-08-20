package com.bookinghomestay.app.application.homestay.query;

import com.bookinghomestay.app.api.dto.homestay.HomestayResponseDto;
import com.bookinghomestay.app.domain.exception.ResourceNotFoundException;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.infrastructure.mapper.HomestayMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetTopHomestayQueryHandler {

    private final IHomestayRepository homestayRepository;

    public List<HomestayResponseDto> handle() {
        List<Homestay> topHomestays = homestayRepository.getTopRated();

        if (topHomestays.isEmpty()) {
            throw new ResourceNotFoundException("Không tìm thấy homestay nào.");
        }

        return topHomestays.stream()
                .map(HomestayMapper::toHomestayResponseDto)
                .collect(Collectors.toList());
    }
}
