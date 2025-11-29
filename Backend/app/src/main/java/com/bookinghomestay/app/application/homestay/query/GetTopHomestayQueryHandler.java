package com.bookinghomestay.app.application.homestay.query;

import com.bookinghomestay.app.application.homestay.dto.HomestayTop5ResponeDto;
import com.bookinghomestay.app.domain.exception.ResourceNotFoundException;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.service.HomestayService;
import com.bookinghomestay.app.infrastructure.mapper.HomestayMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetTopHomestayQueryHandler {

    private final IHomestayRepository homestayRepository;
    private final HomestayService homestayService;

    public List<HomestayTop5ResponeDto> handle() {
        List<Homestay> topHomestays = homestayRepository.getTopRated();

        if (topHomestays.isEmpty()) {
            throw new ResourceNotFoundException("Không tìm thấy homestay nào.");
        }

        List<Homestay> filteredHomestays = new ArrayList<>();
        Set<String> usedKhuVucIds = new HashSet<>();

        for (Homestay homestay : topHomestays) {
            String khuVucId = homestay.getKhuVuc().getMaKv();
            boolean hasActiveRoom = homestay.getPhongs() != null &&
                    !homestay.getPhongs().isEmpty() &&
                    homestay.getPhongs().stream().anyMatch(phong -> "Active".equalsIgnoreCase(phong.getTrangThai()));

            if (!usedKhuVucIds.contains(khuVucId) &&
                    "Active".equalsIgnoreCase(homestay.getTrangThai()) &&
                    hasActiveRoom &&
                    filteredHomestays.size() < 5) {
                filteredHomestays.add(homestay);
                usedKhuVucIds.add(khuVucId);
            }
        }

        if (filteredHomestays.isEmpty()) {
            throw new ResourceNotFoundException(
                    "Không tìm thấy homestay nào !");
        }
        return filteredHomestays.stream()
                .map(homestay -> {
                    BigDecimal minPrice = homestayService.caculateMinRoomPriceByHomestay(homestay);
                    return HomestayMapper.toHomestayTop5ResponseDto(homestay, minPrice);
                })
                .collect(Collectors.toList());
    }
}