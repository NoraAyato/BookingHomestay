package com.bookinghomestay.app.application.admin.service.command;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.DichVuHs;
import com.bookinghomestay.app.domain.repository.IHomestayServiceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateServiceCommandHandler {
    private final IHomestayServiceRepository homestayServiceRepository;

    public void handle(String serviceName) {
        try {
            boolean existingServices = homestayServiceRepository.getAllDichVuHs().stream()
                    .anyMatch(dv -> dv.getTenDichVuHomestay().equalsIgnoreCase(serviceName));
            if (existingServices) {
                throw new RuntimeException("Dịch vụ đã tồn tại trong hệ thống.");
            }
            DichVuHs dichVuHs = new DichVuHs();
            dichVuHs.setMaDichVuHomestay("DVH-" + UUID.randomUUID().toString().substring(0, 6)); // ID will be generated
            dichVuHs.setTenDichVuHomestay(serviceName);
            homestayServiceRepository.save(dichVuHs);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi thêm dịch vụ: " + e.getMessage());
        }

    }
}
