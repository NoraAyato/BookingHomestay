package com.bookinghomestay.app.application.homestay.query;

import com.bookinghomestay.app.api.dto.homestay.HomestayTienNghiResponseDto;
import com.bookinghomestay.app.domain.model.*;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class GetHomestayTienNghiQueryHandler {

    private final IHomestayRepository homestayRepository;

    @Transactional
    public HomestayTienNghiResponseDto handle(GetHomestayTienNghiQuery query) {
        Homestay homestay = homestayRepository.findById(query.getHomestayId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy homestay"));

        List<HomestayTienNghiResponseDto.TienNghiDto> tienNghiDtos = new ArrayList<>();

        for (Phong phong : homestay.getPhongs()) {
            for (ChiTietPhong chiTiet : phong.getChiTietPhongs()) {
                TienNghi tienNghi = chiTiet.getTienNghi();
                tienNghiDtos.add(new HomestayTienNghiResponseDto.TienNghiDto(
                        tienNghi.getMaTienNghi(),
                        tienNghi.getTenTienNghi(),
                        tienNghi.getMoTa(),
                        chiTiet.getSoLuong()));
            }
        }

        return new HomestayTienNghiResponseDto(homestay.getIdHomestay(), tienNghiDtos);
    }
}
