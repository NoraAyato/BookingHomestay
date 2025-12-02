package com.bookinghomestay.app.application.admin.locationmanager.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.KhuVuc;
import com.bookinghomestay.app.domain.repository.IKhuVucRepository;
import com.bookinghomestay.app.infrastructure.file.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateLocationCommandHandler {
    private final IKhuVucRepository khuVucRepository;
    private final FileStorageService fileStorageService;

    public void handle(CreateLocationCommand command) {
        try {
            KhuVuc khuVuc = new KhuVuc();
            khuVuc.setMaKv("KV-" + String.valueOf(System.currentTimeMillis()).substring(5));
            khuVuc.setTenKv(command.getName());
            khuVuc.setMota(command.getDescription());
            if (command.getImage() != null && !command.getImage().isEmpty()) {
                khuVuc.setHinhanh(fileStorageService.storeLocation(command.getImage(), "lcs_"));

            }
            khuVuc.setTrangThai("active");
            khuVucRepository.save(khuVuc);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi thêm khu vực: " + e.getMessage());
        }

    }
}
