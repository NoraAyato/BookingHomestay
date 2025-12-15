package com.bookinghomestay.app.application.host.homestay.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.host.homestay.dto.HostHomestayUpdateRequestDto;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.repository.IKhuVucRepository;
import com.bookinghomestay.app.infrastructure.file.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UpdateHomestayCommandHandler {
    private final IHomestayRepository homestayRepository;
    private final FileStorageService fileStorageService;
    private final IKhuVucRepository khuVucRepository;

    public void handle(String homestayId, HostHomestayUpdateRequestDto command) {
        var homestay = homestayRepository.findById(homestayId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy homestay !"));
        if (command.getLocationId() != null && !command.getLocationId().isEmpty()) {
            var khuVuc = khuVucRepository.findById(command.getLocationId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khu vực !"));
            homestay.setKhuVuc(khuVuc);
        }
        homestay.setTenHomestay(command.getName());
        homestay.setGioiThieu(command.getDescription());
        homestay.setDiaChi(command.getAddress());
        homestay.setTrangThai(command.getStatus());
        if (command.getImage() != null && !command.getImage().isEmpty()) {
            String imageUrl = fileStorageService.storeHomestayImage(command.getImage(), "HS_");
            homestay.setHinhAnh(imageUrl);
        }
        homestayRepository.save(homestay);
    }
}
