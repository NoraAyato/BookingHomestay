package com.bookinghomestay.app.application.admin.location.command;

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
            String idKV = khuVucRepository.getAll().stream()
                    .filter(loc -> loc.getTenKv().equals(command.getName()))
                    .findFirst().get().getMaKv();
            if (idKV != null && !idKV.equals(command.getId())) {
                throw new IllegalArgumentException("Khu vực với tên này đã tồn tại !");
            }
            
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
