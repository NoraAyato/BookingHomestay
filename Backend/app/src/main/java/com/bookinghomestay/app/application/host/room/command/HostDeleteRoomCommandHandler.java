package com.bookinghomestay.app.application.host.room.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.repository.IRoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HostDeleteRoomCommandHandler {
    private final IRoomRepository roomRepository;

    public void handle(String roomId, String userId) {
        var room = roomRepository.getAll().stream()
                .filter(r -> r.getMaPhong().equals(roomId) && r.getHomestay().getNguoiDung().getUserId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Phòng không tồn tại !"));
        boolean isOwned = room.getHomestay().getNguoiDung().getUserId().equalsIgnoreCase(userId);
        if (!isOwned) {
            throw new RuntimeException("Bạn không có quyền xóa phòng này !");
        }
        if (room.getChiTietDatPhongs() != null && !room.getChiTietDatPhongs().isEmpty()) {
            throw new RuntimeException("Phòng đã được sử dụng không được xóa !");
        }
        room.getChiTietDatPhongs().clear();
        room.getHinhAnhPhongs().clear();
        roomRepository.delete(room.getMaPhong());
    }
}
