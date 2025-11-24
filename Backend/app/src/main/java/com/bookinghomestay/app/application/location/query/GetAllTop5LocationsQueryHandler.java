package com.bookinghomestay.app.application.location.query;

import com.bookinghomestay.app.application.location.dto.LocationTop5ResponeDto;
import com.bookinghomestay.app.domain.repository.IKhuVucRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetAllTop5LocationsQueryHandler {
    private final IKhuVucRepository khuVucRepository;

    public List<LocationTop5ResponeDto> handle() {
        var listKV = khuVucRepository.getAllByHomestayCout(5);
        return listKV.stream()
                .map(e -> new LocationTop5ResponeDto(
                        e.getMaKv(),
                        e.getTenKv(),
                        e.getMota(),
                        e.getHinhanh(),
                        e.getHomestays().size() > 0 ? e.getHomestays().size() : 0))
                .collect(Collectors.toList());
    }
}