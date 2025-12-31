package com.bookinghomestay.app.application.host.service.command;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.host.service.dto.HostServiceUpdateRequestDto;
import com.bookinghomestay.app.domain.model.DichVu;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.repository.IServiceRepository;
import com.bookinghomestay.app.infrastructure.file.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HostUpdateServiceCommandHandler {
    private final IServiceRepository serviceRepository;
    private final FileStorageService fileStorageService;
    private final IHomestayRepository homestayRepository;

    public void handle(String serviceId, HostServiceUpdateRequestDto command, String hostId) {
        DichVu service = serviceRepository.findServiceById(serviceId)
                .orElseThrow(() -> new RuntimeException("Không tồn tại dịch vụ này !"));
        if (!service.getHomestay().getNguoiDung().getUserId().equalsIgnoreCase(hostId)) {
            throw new RuntimeException("Bạn không có quyền cập nhật dịch vụ này !");
        }
        if (command.getHomestayId() != null && !command.getHomestayId().isEmpty()) {
            var homestay = homestayRepository.findById(command.getHomestayId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy homestay !"));
            service.setHomestay(homestay);
        }
        service.setMoTa(command.getDescription());
        if (command.getImage() != null && !command.getImage().isEmpty()) {
            try {
                String imageUrl = fileStorageService.storeService(command.getImage(), "services-");
                service.setHinhAnh(imageUrl);
            } catch (Exception e) {
                throw new RuntimeException("Lỗi khi xử lý hình ảnh dịch vụ !");
            }
        }
        service.setDonGia(BigDecimal.valueOf(command.getPrice()));
        serviceRepository.updateService(service);
    }
}
