package com.bookinghomestay.app.application.homestay.query;

import com.bookinghomestay.app.api.dto.homestay.RoomDetailResponseDTO;
import com.bookinghomestay.app.domain.exception.ResourceNotFoundException;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetRoomDetailQueryHandler {

    private final IHomestayRepository homestayRepository;

    @Transactional(readOnly = true)
    public RoomDetailResponseDTO handle(String maPhong) {
        Optional<RoomDetailResponseDTO> roomDetailOpt = homestayRepository.findPhongDetailById(maPhong);

        return roomDetailOpt
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng với mã: " + maPhong));
    }
}
