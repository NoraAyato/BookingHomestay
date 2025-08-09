package com.bookinghomestay.app.application.homestay.query;

import com.bookinghomestay.app.api.dto.homestay.HomestayTienNghiResponseDto;
import com.bookinghomestay.app.domain.model.*;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetHomestayTienNghiQueryHandler {

    private final IHomestayRepository homestayRepository;

    @Transactional
    public HomestayTienNghiResponseDto handle(GetHomestayTienNghiQuery query) {
        Homestay homestay = homestayRepository.findById(query.getHomestayId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy homestay"));

        List<HomestayTienNghiResponseDto.TienNghiDto> tienNghiDtos = homestay.getPhongs().stream()
                .flatMap(phong -> phong.getChiTietPhongs().stream())
                .collect(Collectors.toMap(
                        chiTiet -> chiTiet.getTienNghi().getMaTienNghi(), 
                        chiTiet -> new HomestayTienNghiResponseDto.TienNghiDto(
                                chiTiet.getTienNghi().getMaTienNghi(),
                                chiTiet.getTienNghi().getTenTienNghi(),
                                chiTiet.getTienNghi().getMoTa(),
                                chiTiet.getSoLuong()),
                        (existing, replacement) -> {
                            existing.setSoLuong(existing.getSoLuong() + replacement.getSoLuong());
                            return existing;
                        }))
                .values().stream()
                .collect(Collectors.toList());

        return new HomestayTienNghiResponseDto(homestay.getIdHomestay(), tienNghiDtos);
    }
}
