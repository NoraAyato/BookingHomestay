package com.bookinghomestay.app.application.homestay.query;

import com.bookinghomestay.app.api.dto.homestay.RoomAvailabilityDto;
import com.bookinghomestay.app.domain.exception.ResourceNotFoundException;

import com.bookinghomestay.app.domain.model.Phong;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.service.PendingRoomService;

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
    private final PendingRoomService pendingRoomService; // service check Redis

    @Transactional(readOnly = true)
    public List<RoomAvailabilityDto> handle(String homestayId, LocalDateTime ngayDen, LocalDateTime ngayDi) {
        List<Phong> rooms = homestayRepository.findAvailableRoomsByHomestayId(homestayId, ngayDen, ngayDi);

        if (rooms.isEmpty()) {
            throw new ResourceNotFoundException("Hiện không có phòng khả dụng !");
        }

        List<RoomAvailabilityDto> availableRooms = rooms.stream()
                .filter(phong -> pendingRoomService.isRoomAvailable(
                        phong.getMaPhong(),
                        ngayDen.toLocalDate(),
                        ngayDi.toLocalDate()))
                .map(phong -> new RoomAvailabilityDto(
                        phong.getMaPhong(),
                        phong.getTenPhong(),
                        phong.getDonGia()))
                .collect(Collectors.toList());

        if (availableRooms.isEmpty()) {
            throw new ResourceNotFoundException("Tất cả phòng hiện đang được đặt !");
        }
        return availableRooms;
    }
}
