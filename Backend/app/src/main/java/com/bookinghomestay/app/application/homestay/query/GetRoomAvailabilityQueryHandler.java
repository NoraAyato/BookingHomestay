package com.bookinghomestay.app.application.homestay.query;

import com.bookinghomestay.app.api.dto.homestay.RoomAvailabilityDto;
import com.bookinghomestay.app.domain.exception.ResourceNotFoundException;
import com.bookinghomestay.app.domain.model.Phong;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.service.PendingRoomService;
import com.bookinghomestay.app.domain.service.RoomService;
import com.bookinghomestay.app.infrastructure.mapper.RoomMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetRoomAvailabilityQueryHandler {

    private final IHomestayRepository homestayRepository;
    private final PendingRoomService pendingRoomService; // service check Redis
    private final RoomService roomService;

    @Transactional(readOnly = true)
    public List<RoomAvailabilityDto> handle(GetRoomAvailabilityQuery query) {
        List<Phong> rooms = homestayRepository.findAvailableRoomsByHomestayId(query.getHomestayId(),
                query.getNgayDen().atStartOfDay(),
                query.getNgayDi().atStartOfDay());
        // Lọc phòng khả dụng thông qua domain service và Redis
        List<RoomAvailabilityDto> availableRooms = rooms.stream()
                .filter(phong -> roomService.isRoomAvailable(phong, query.getNgayDen(),
                        query.getNgayDi()))
                .filter(phong -> pendingRoomService.isRoomAvailable(
                        phong.getMaPhong(),
                        query.getNgayDen(),
                        query.getNgayDi()))
                .map(phong -> {
                    return RoomMapper.toRoomAvailabilityDto(
                            phong, roomService.isRoomAvailable(phong, query.getNgayDen(), query.getNgayDi()),
                            roomService.getDiscountPriceOfRoom(phong));
                }).collect(Collectors.toList());

        if (availableRooms.isEmpty()) {
            throw new ResourceNotFoundException("Tất cả phòng hiện đang được đặt !");
        }

        return availableRooms;
    }
}
