package com.bookinghomestay.app.application.host.room.query;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.host.room.dto.RoomTypeDataResponse;
import com.bookinghomestay.app.domain.repository.IRoomTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetRoomTypeListQueryHandler {
    private final IRoomTypeRepository roomTypeRepository;

    public List<RoomTypeDataResponse> handler() {
        List<RoomTypeDataResponse> list = roomTypeRepository.findAll().stream().map(roomType -> {
            RoomTypeDataResponse dto = new RoomTypeDataResponse();
            dto.setId(roomType.getIdLoai());
            dto.setName(roomType.getTenLoai());
            dto.setDescription(roomType.getMoTa());
            return dto;
        }).toList();
        return list;
    }
}
