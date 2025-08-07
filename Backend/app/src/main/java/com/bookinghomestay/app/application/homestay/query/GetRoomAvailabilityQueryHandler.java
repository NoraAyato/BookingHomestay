package com.bookinghomestay.app.application.homestay.query;

import com.bookinghomestay.app.api.dto.homestay.RoomAvailabilityDto;
import com.bookinghomestay.app.domain.exception.ResourceNotFoundException;

import com.bookinghomestay.app.domain.model.Phong;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetRoomAvailabilityQueryHandler {

    private final IHomestayRepository homestayRepository;

    @Transactional(readOnly = true)
    public List<RoomAvailabilityDto> handle(String homestayId, LocalDateTime ngayDen, LocalDateTime ngayDi) {
        List<Phong> rooms = homestayRepository.findAvailableRoomsByHomestayId(homestayId, ngayDen, ngayDi);
        if (rooms.isEmpty()) {
            throw new ResourceNotFoundException("Không tìm thấy phòng nào cho homestay với ID: " + homestayId);
        }
        return rooms.stream()
                .map(phong -> new RoomAvailabilityDto(phong.getMaPhong(), phong.getTenPhong(), phong.getDonGia()))
                .collect(Collectors.toList());
    }
}