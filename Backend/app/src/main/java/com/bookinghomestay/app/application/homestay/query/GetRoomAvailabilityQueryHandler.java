package com.bookinghomestay.app.application.homestay.query;

import com.bookinghomestay.app.api.dto.homestay.RoomAvailabilityDto;
import com.bookinghomestay.app.domain.exception.ResourceNotFoundException;
import com.bookinghomestay.app.domain.model.Phong;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.service.HomestayService;
import com.bookinghomestay.app.domain.service.PendingRoomService;
import com.bookinghomestay.app.infrastructure.mapper.HomestayMapper;

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
    private final HomestayService homestayDomainService;

    @Transactional(readOnly = true)
    public List<RoomAvailabilityDto> handle(String homestayId, LocalDateTime ngayDen, LocalDateTime ngayDi) {
        List<Phong> rooms = homestayRepository.findAvailableRoomsByHomestayId(homestayId, ngayDen, ngayDi);

        if (rooms.isEmpty()) {
            throw new ResourceNotFoundException("Hiện không có phòng khả dụng !");
        }

        // Lọc phòng khả dụng thông qua domain service và Redis
        List<Phong> availableRooms = rooms.stream()
                .filter(phong -> homestayDomainService.isRoomAvailable(phong, ngayDen.toLocalDate(),
                        ngayDi.toLocalDate()))
                .filter(phong -> pendingRoomService.isRoomAvailable(
                        phong.getMaPhong(),
                        ngayDen.toLocalDate(),
                        ngayDi.toLocalDate()))
                .collect(Collectors.toList());

        if (availableRooms.isEmpty()) {
            throw new ResourceNotFoundException("Tất cả phòng hiện đang được đặt !");
        }

        // Chuyển đổi sang DTO thông qua mapper
        return availableRooms.stream()
                .map(HomestayMapper::toRoomAvailabilityDto)
                .collect(Collectors.toList());
    }
}
