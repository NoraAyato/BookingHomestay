package com.bookinghomestay.app.application.host.room.command;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.bookinghomestay.app.application.host.room.dto.RoomUpdateRequestDto;
import com.bookinghomestay.app.domain.model.Phong;
import com.bookinghomestay.app.domain.model.TienNghi;
import com.bookinghomestay.app.domain.repository.IRoomRepository;
import com.bookinghomestay.app.domain.repository.IRoomTypeRepository;
import com.bookinghomestay.app.domain.repository.ITienNghiRepository;
import com.bookinghomestay.app.infrastructure.file.FileStorageService;

import jakarta.transaction.Transactional;

import com.bookinghomestay.app.domain.model.ChiTietPhong;
import com.bookinghomestay.app.domain.model.HinhAnhPhong;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HostUpdateRoomCommandHandler {
    private final IRoomRepository roomRepository;
    private final IRoomTypeRepository roomTypeRepository;
    private final FileStorageService fileStorageService;
    private final ITienNghiRepository tienNghiRepository;

    @Transactional
    public void handle(String roomId, RoomUpdateRequestDto dto, List<String> amenitiesIds, List<MultipartFile> images,
            String hostId) {
        try {
            Phong room = roomRepository.getById(roomId)
                    .orElseThrow(() -> new RuntimeException("Phòng không tồn tại !"));
            String exsitRoomNameId = roomRepository.getAll().stream()
                    .filter(rm -> rm.getHomestay().getNguoiDung().getUserId().equalsIgnoreCase(hostId))
                    .filter(rm -> rm.getTenPhong().equalsIgnoreCase(dto.getRoomName()))
                    .map(Phong::getMaPhong).findFirst().orElse(null);
            boolean isOwned = room.getHomestay().getNguoiDung().getUserId().equalsIgnoreCase(hostId);
            if (!isOwned) {
                throw new RuntimeException("Bạn không có quyền cập nhật phòng này !");
            }
            if (exsitRoomNameId != null && !exsitRoomNameId.equalsIgnoreCase(roomId)) {
                throw new RuntimeException("Có phòng đã sử dụng tên này !");
            }
            room.setTenPhong(dto.getRoomName());
            room.setTrangThai(dto.getStatus());
            room.setDonGia(BigDecimal.valueOf(dto.getPricePerNight()));
            room.setSoNguoi(dto.getCapacity());
            if (dto.getRoomTypeId() != null && !dto.getRoomTypeId().isEmpty()) {
                var roomType = roomTypeRepository.findById(dto.getRoomTypeId())
                        .orElseThrow(() -> new RuntimeException("Loại phòng không tồn tại !"));
                room.setLoaiPhong(roomType);
            }
            if (images != null && !images.isEmpty()) {
                room.getHinhAnhPhongs().clear();
                List<HinhAnhPhong> imagesList = new ArrayList<>();
                for (int i = 0; i < images.size(); i++) {
                    if (i == 0) {
                        HinhAnhPhong image = new HinhAnhPhong();
                        image.setLaAnhChinh(true);
                        String imageUrl = fileStorageService.storeRoomImage(images.get(i), "RP_");
                        image.setUrlAnh(imageUrl);
                        image.setMoTa("Ảnh chính phòng " + dto.getRoomName());
                        image.setPhong(room);
                        imagesList.add(image);
                    } else {
                        HinhAnhPhong image = new HinhAnhPhong();
                        image.setLaAnhChinh(false);
                        String imageUrl = fileStorageService.storeRoomImage(images.get(i), "RP_");
                        image.setUrlAnh(imageUrl);
                        image.setMoTa("Ảnh phụ phòng " + dto.getRoomName());
                        image.setPhong(room);
                        imagesList.add(image);
                    }
                }
                room.getHinhAnhPhongs().addAll(imagesList);
            }
            if (amenitiesIds != null && !amenitiesIds.isEmpty()) {
                // Xóa toàn bộ tiện nghi cũ
                room.getChiTietPhongs().clear();
                List<ChiTietPhong> newDetails = new ArrayList<>();
                for (String tienNghiId : amenitiesIds) {
                    TienNghi tn = tienNghiRepository.findById(tienNghiId)
                            .orElseThrow(() -> new RuntimeException("Tiện nghi không tồn tại: " + tienNghiId));
                    ChiTietPhong ctp = new ChiTietPhong();
                    ctp.setPhong(room);
                    ctp.setTienNghi(tn);
                    ctp.setSoLuong(1);
                    newDetails.add(ctp);
                }
                room.getChiTietPhongs().addAll(newDetails);
            }
            roomRepository.save(room);
        } catch (Exception e) {
            throw new RuntimeException("Cập nhật phòng thất bại: " + e.getMessage());
        }
    }

}
