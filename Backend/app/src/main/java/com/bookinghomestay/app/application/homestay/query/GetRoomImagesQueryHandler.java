package com.bookinghomestay.app.application.homestay.query;

import com.bookinghomestay.app.api.dto.homestay.RoomImagesDto;
import com.bookinghomestay.app.domain.exception.ResourceNotFoundException;
import com.bookinghomestay.app.domain.model.Phong;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.infrastructure.mapper.HomestayMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetRoomImagesQueryHandler {
        private final IHomestayRepository homestayRepository;

        public RoomImagesDto handle(String maphong) {
                Phong room = homestayRepository.findPhongById(maphong)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Không tìm thấy phòng với mã: " + maphong));

                return HomestayMapper.toRoomImagesDto(room);
        }
}
