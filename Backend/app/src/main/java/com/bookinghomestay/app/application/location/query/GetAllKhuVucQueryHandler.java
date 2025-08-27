package com.bookinghomestay.app.application.location.query;

import com.bookinghomestay.app.api.dto.location.KhuVucResponseDto;
import com.bookinghomestay.app.domain.repository.IKhuVucRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetAllKhuVucQueryHandler {

    private final IKhuVucRepository khuVucRepository;

    public List<KhuVucResponseDto> handle() {
        return khuVucRepository.getAll().stream()
                .map(kv -> new KhuVucResponseDto(kv.getMaKv(), kv.getTenKv()))
                .collect(Collectors.toList());
    }
}
