package com.bookinghomestay.app.application.homestay.query;

import com.bookinghomestay.app.api.dto.homestay.HomestayDichVuResponseDto;
import com.bookinghomestay.app.domain.model.DichVu;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetHomestayDichVuQueryHandler {

    private final IHomestayRepository homestayRepository;

    @Transactional
    public HomestayDichVuResponseDto handle(GetHomestayDichVuQuery query) {
        Homestay homestay = homestayRepository.findById(query.getHomestayId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy homestay"));

        List<HomestayDichVuResponseDto.DichVuDto> dichVuDtos = homestay.getDichVus().stream()
                .map(dv -> new HomestayDichVuResponseDto.DichVuDto(
                        dv.getMaDV(),
                        dv.getTenDV(),
                        dv.getDonGia(),
                        dv.getHinhAnh()))
                .collect(Collectors.toList());

        return new HomestayDichVuResponseDto(homestay.getIdHomestay(), dichVuDtos);
    }
}
