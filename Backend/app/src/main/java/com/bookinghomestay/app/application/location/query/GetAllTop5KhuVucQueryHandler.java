package com.bookinghomestay.app.application.location.query;

import com.bookinghomestay.app.api.dto.location.KhuVucResponseDto;
import com.bookinghomestay.app.api.dto.location.KhuVucTop5ResponeDto;
import com.bookinghomestay.app.domain.repository.IKhuVucRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetAllTop5KhuVucQueryHandler {
    private final IKhuVucRepository khuVucRepository;

    public List<KhuVucTop5ResponeDto> handle() {
        var listKV = khuVucRepository.getTop5ByHomestayCount().subList(0,
                Math.min(khuVucRepository.getTop5ByHomestayCount().size(), 5));
        return listKV.stream()
                .map(e -> new KhuVucTop5ResponeDto(
                        e.getMaKv(),
                        e.getTenKv(),
                        e.getMota(),
                        e.getHinhanh(),
                        e.getHomestays().size() > 0 ? e.getHomestays().size() : 0))
                .collect(Collectors.toList());
    }
}