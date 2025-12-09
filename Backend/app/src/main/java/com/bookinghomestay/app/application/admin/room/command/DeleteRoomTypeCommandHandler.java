package com.bookinghomestay.app.application.admin.room.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.LoaiPhong;
import com.bookinghomestay.app.domain.repository.IRoomTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeleteRoomTypeCommandHandler {
    private final IRoomTypeRepository roomTypeRepository;

    public void handle(String id) {
        try {
            LoaiPhong roomType = roomTypeRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy loại phòng này !"));
            if (roomType.getPhongs().size() > 0) {
                throw new RuntimeException("Không thể xóa loại phòng này vì có phòng đang sử dụng loại phòng này !");
            }
            roomTypeRepository.deleteById(roomType.getIdLoai());
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi xóa loại phòng: " + e.getMessage());
        }

    }
}
