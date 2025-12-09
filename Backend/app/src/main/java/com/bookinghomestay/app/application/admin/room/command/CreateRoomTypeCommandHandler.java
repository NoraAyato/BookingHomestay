package com.bookinghomestay.app.application.admin.room.command;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.room.dto.CreateRoomTypeRequestDto;
import com.bookinghomestay.app.domain.model.LoaiPhong;
import com.bookinghomestay.app.domain.repository.IRoomTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateRoomTypeCommandHandler {
    private final IRoomTypeRepository roomTypeRepository;

    public void handle(CreateRoomTypeRequestDto command) {
        try {
            boolean existingRoomTypes = roomTypeRepository.findAll().stream()
                    .anyMatch(tp -> tp.getTenLoai().equalsIgnoreCase(command.getName()));
            if (existingRoomTypes) {
                throw new IllegalArgumentException("Loại phòng với tên này đã tồn tại !");
            }
            LoaiPhong roomType = new LoaiPhong();
            roomType.setIdLoai("LP-" + UUID.randomUUID().toString().substring(0, 7).toUpperCase());
            roomType.setTenLoai(command.getName());
            roomType.setMoTa(command.getDescription());
            roomTypeRepository.save(roomType);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo loại phòng: " + e.getMessage());
        }

    }
}
