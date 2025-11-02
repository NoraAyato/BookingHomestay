package com.bookinghomestay.app.application.homestay.query;

import com.bookinghomestay.app.application.homestay.dto.HomestayResponseDto;
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
public class GetAllHomestayQueryHandler {

    private final IHomestayRepository homestayRepository;

    public List<HomestayResponseDto> handle() {
        List<Homestay> homestays = homestayRepository.getAll();

        if (homestays.isEmpty()) {
            throw new ResourceNotFoundException("Không tìm thấy homestay nào.");
        }

        return homestays.stream()
                .map(HomestayMapper::toHomestayResponseDto)
                .collect(Collectors.toList());
    }
}
