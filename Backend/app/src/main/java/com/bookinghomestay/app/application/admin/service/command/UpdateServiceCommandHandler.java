package com.bookinghomestay.app.application.admin.service.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.repository.IHomestayServiceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UpdateServiceCommandHandler {
    private final IHomestayServiceRepository homestayServiceRepository;

    public void handle(String serviceId, String newServiceName) {

        // Lấy dịch vụ cần cập nhật
        var optionalService = homestayServiceRepository.findById(serviceId);
        if (optionalService.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy dịch vụ!");
        }

        // Kiểm tra tên trùng với dịch vụ khác
        var existing = homestayServiceRepository.getAllDichVuHs().stream()
                .filter(dv -> dv.getTenDichVuHomestay().equalsIgnoreCase(newServiceName))
                .findFirst()
                .orElse(null);

        if (existing != null && !existing.getMaDichVuHomestay().equals(serviceId)) {
            throw new IllegalArgumentException("Dịch vụ với tên này đã tồn tại!");
        }

        // Cập nhật
        var service = optionalService.get();
        service.setTenDichVuHomestay(newServiceName);
        homestayServiceRepository.save(service);
    }
}
