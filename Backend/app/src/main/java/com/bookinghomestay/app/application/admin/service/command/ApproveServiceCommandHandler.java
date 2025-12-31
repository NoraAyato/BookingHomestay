package com.bookinghomestay.app.application.admin.service.command;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.repository.IServiceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ApproveServiceCommandHandler {
    private final IServiceRepository serviceRepository;

    public void handle(String serviceId) {
        var optionalService = serviceRepository.findServiceById(serviceId);
        if (optionalService.isPresent()) {
            var service = optionalService.get();
            service.setTrangThai("APPROVED");
            service.setNgayDuyet(LocalDateTime.now());
            serviceRepository.updateService(service);
        } else {
            throw new IllegalArgumentException("Không tìm thấy dịch vụ !");
        }
    }
}
