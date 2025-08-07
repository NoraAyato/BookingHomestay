package com.bookinghomestay.app.application.homestay.query;

import com.bookinghomestay.app.api.dto.homestay.RoomImagesDto;
import com.bookinghomestay.app.domain.exception.ResourceNotFoundException;
import com.bookinghomestay.app.domain.model.HinhAnhPhong;
import com.bookinghomestay.app.domain.model.Phong;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetRoomImagesQueryHandler {
        private final IHomestayRepository homestayRepository;

        public RoomImagesDto handle(String maphong) {
                Phong rooms = homestayRepository.findPhongById(maphong)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Không tìm thấy phòng với mã: " + maphong));

                return new RoomImagesDto(
                                rooms.getMaPhong(),
                                rooms.getHinhAnhPhongs().stream()
                                                .map(HinhAnhPhong::getUrlAnh)
                                                .collect(Collectors.toList()));
        }
}
