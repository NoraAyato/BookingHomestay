package com.bookinghomestay.app.application.homestay.query;

import com.bookinghomestay.app.api.dto.homestay.HomestayImageResponseDto;
import com.bookinghomestay.app.domain.model.HinhAnhPhong;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetHomestayImagesQueryHandler {

    private final IHomestayRepository homestayRepository;

    @Transactional
    public HomestayImageResponseDto handle(GetHomestayImagesQuery query) {
        Homestay homestay = homestayRepository.findById(query.getHomestayId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy homestay"));

        List<String> roomImages = homestay.getPhongs().stream()
                .flatMap(phong -> phong.getHinhAnhPhongs().stream())
                .map(HinhAnhPhong::getUrlAnh)
                .collect(Collectors.toList());

        return new HomestayImageResponseDto(
                homestay.getIdHomestay(),
                homestay.getHinhAnh(),
                roomImages);
    }
}
