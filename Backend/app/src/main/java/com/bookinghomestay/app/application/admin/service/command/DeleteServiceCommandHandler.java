package com.bookinghomestay.app.application.admin.service.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.repository.IHomestayServiceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeleteServiceCommandHandler {
    private final IHomestayServiceRepository homestayServiceRepository;

    public void handle(String serviceId) {
        try {
            var optionalService = homestayServiceRepository.findById(serviceId);

            if (optionalService.isPresent()) {
                if (optionalService.get().getDichVus().size() > 0) {
                    throw new RuntimeException("Không thể xóa dịch vụ này vì homestay đang sử dụng dịch vụ này !");
                }
                homestayServiceRepository.deleteById(serviceId);
            } else {
                throw new IllegalArgumentException("Không tìm thấy dịch vụ !");
            }
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi xóa dịch vụ: " + e.getMessage());
        }
    }
}
