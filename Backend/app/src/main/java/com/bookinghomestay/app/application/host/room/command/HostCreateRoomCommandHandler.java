package com.bookinghomestay.app.application.host.room.command;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.bookinghomestay.app.application.host.room.dto.HostRoomCreateRequestDto;
import com.bookinghomestay.app.domain.model.ChiTietPhong;
import com.bookinghomestay.app.domain.model.HinhAnhPhong;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.LoaiPhong;
import com.bookinghomestay.app.domain.model.Phong;
import com.bookinghomestay.app.domain.model.TienNghi;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.repository.IRoomRepository;
import com.bookinghomestay.app.domain.repository.IRoomTypeRepository;
import com.bookinghomestay.app.domain.repository.ITienNghiRepository;
import com.bookinghomestay.app.infrastructure.file.FileStorageService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HostCreateRoomCommandHandler {
    private final IRoomRepository roomRepository;
    private final IRoomTypeRepository roomTypeRepository;
    private final FileStorageService fileStorageService;
    private final ITienNghiRepository tienNghiRepository;
    private final IHomestayRepository homestayRepository;

    @Transactional
    public void handle(HostRoomCreateRequestDto dto, List<String> amenitiesIds, List<MultipartFile> images) {
        try {
            System.out.println("Received DTO: " + dto.toString());
            Homestay homestay = homestayRepository.findById(dto.getHomestayId())
                    .orElseThrow(() -> new RuntimeException("Homestay không tồn tại"));
            LoaiPhong roomType = roomTypeRepository.findById(dto.getRoomTypeId())
                    .orElseThrow(() -> new RuntimeException("Loại phòng không tồn tại"));
            // String existRoomNameId = roomRepository.getAll().stream()
            // .filter(rm -> rm.getHomestay() != null
            // && rm.getHomestay().getIdHomestay().equalsIgnoreCase(dto.getHomestayId()))
            // .filter(rm -> rm.getTenPhong().equalsIgnoreCase(dto.getName()))
            // .map(Phong::getMaPhong).findFirst().orElse(null);
            // if (existRoomNameId != null) {
            // throw new RuntimeException("Có phòng đã sử dụng tên này !");
            // }
            Phong phong = new Phong();
            phong.setMaPhong("R_" + UUID.randomUUID().toString().substring(0, 8));
            phong.setTenPhong(dto.getName());
            phong.setDonGia(BigDecimal.valueOf(dto.getPrice()));
            phong.setSoNguoi(dto.getCapacity());
            phong.setTrangThai(dto.getStatus());
            phong.setHomestay(homestay);
            phong.setIdHomestay(homestay.getIdHomestay());
            phong.setLoaiPhong(roomType);
            phong.setIdLoai(roomType.getIdLoai());
            if (amenitiesIds != null && !amenitiesIds.isEmpty()) {
                phong.getChiTietPhongs().clear();
                List<ChiTietPhong> newDetails = new ArrayList<>();
                for (String tienNghiId : amenitiesIds) {
                    TienNghi tn = tienNghiRepository.findById(tienNghiId)
                            .orElseThrow(() -> new RuntimeException("Tiện nghi không tồn tại: " + tienNghiId));
                    ChiTietPhong ctp = new ChiTietPhong();
                    ctp.setPhong(phong);
                    ctp.setTienNghi(tn);
                    ctp.setSoLuong(1);
                    newDetails.add(ctp);
                }
                phong.getChiTietPhongs().addAll(newDetails);
            }
            if (images != null && !images.isEmpty()) {
                phong.getHinhAnhPhongs().clear();
                List<HinhAnhPhong> imagesRoom = new ArrayList<>();
                for (int i = 0; i < images.size(); i++) {
                    HinhAnhPhong image = new HinhAnhPhong();
                    image.setLaAnhChinh(i == 0);
                    String imageUrl = fileStorageService.storeRoomImage(images.get(i), "RP_");
                    image.setUrlAnh(imageUrl);
                    image.setMoTa((i == 0 ? "Ảnh chính phòng " : "Ảnh phụ phòng ") + dto.getName());
                    image.setPhong(phong);
                    imagesRoom.add(image);
                }
                phong.getHinhAnhPhongs().addAll(imagesRoom);
            }
            roomRepository.save(phong);
        } catch (Exception e) {
            throw new RuntimeException("Tạo phòng thất bại: " + e.getMessage());
        }
    }
}
