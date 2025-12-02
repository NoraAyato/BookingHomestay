package com.bookinghomestay.app.application.admin.locationmanager.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.KhuVuc;
import com.bookinghomestay.app.domain.repository.IKhuVucRepository;
import com.bookinghomestay.app.infrastructure.file.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UpdateLocationCommandHandler {
    private final IKhuVucRepository khuVucRepository;
    private final FileStorageService fileStorageService;

    public void handle(UpdateLocationCommand command) {
        try {
            KhuVuc khuVuc = khuVucRepository.findById(command.getId())
                    .orElseThrow(() -> new RuntimeException("Khu vực không tồn tại !"));
            khuVuc.setTenKv(command.getName());
            khuVuc.setMota(command.getDescription());
            if (command.getImage() != null && !command.getImage().isEmpty()) {
                khuVuc.setHinhanh(fileStorageService.storeLocation(command.getImage(), "lcs_"));
            }
            khuVuc.setTrangThai(command.getStatus());
            khuVucRepository.save(khuVuc);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi cập nhật khu vực: " + e.getMessage());
        }

    }
}
