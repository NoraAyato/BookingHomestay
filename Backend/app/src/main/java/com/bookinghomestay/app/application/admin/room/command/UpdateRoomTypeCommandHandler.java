package com.bookinghomestay.app.application.admin.room.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.room.dto.UpdateRoomTypeRequest;
import com.bookinghomestay.app.domain.repository.IRoomTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UpdateRoomTypeCommandHandler {
    private final IRoomTypeRepository roomTypeRepository;

    public void handle(String roomTypeId, UpdateRoomTypeRequest command) {

        // Lấy loại phòng cần update
        var roomTypeOpt = roomTypeRepository.findById(roomTypeId);
        if (roomTypeOpt.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy loại phòng này!");
        }

        // Tìm loại phòng trùng tên
        var existing = roomTypeRepository.findAll().stream()
                .filter(lp -> lp.getTenLoai().equalsIgnoreCase(command.getNewName()))
                .findFirst()
                .orElse(null);

        // Nếu tồn tại và không phải chính loại phòng đang sửa → báo lỗi
        if (existing != null && !existing.getIdLoai().equals(roomTypeId)) {
            throw new IllegalArgumentException("Loại phòng với tên này đã tồn tại!");
        }

        // Update dữ liệu
        var roomType = roomTypeOpt.get();
        roomType.setTenLoai(command.getNewName());
        roomType.setMoTa(command.getNewDescription());

        roomTypeRepository.save(roomType);
    }

}
