package com.bookinghomestay.app.application.host.service.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.repository.IServiceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HostDeleteServiceCommandHandler {
    private final IServiceRepository serviceRepository;

    public void handle(String serviceId, String userId) {
        try {

            var service = serviceRepository.findServiceById(serviceId)
                    .orElseThrow(() -> new IllegalArgumentException("Dịch vụ không tồn tại !"));

            if (!service.getHomestay().getNguoiDung().getUserId().equalsIgnoreCase(userId)) {
                throw new IllegalArgumentException("Bạn không có quyền xóa dịch vụ này !");
            }
            if (service.getChiTietDichVus() != null && !service.getChiTietDichVus().isEmpty()) {
                throw new IllegalArgumentException("Dịch vụ đang được sử dụng, không thể xóa !");
            }
            serviceRepository.deleteService(service.getMaDV());
        } catch (Exception e) {
            throw new IllegalArgumentException("Xóa dịch vụ thất bại !" + e.toString());
        }
    }
}
