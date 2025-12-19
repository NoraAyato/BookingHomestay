package com.bookinghomestay.app.application.host.service.command;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.host.service.dto.HostServiceCreateRequestDto;
import com.bookinghomestay.app.domain.model.DichVu;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.repository.IServiceRepository;
import com.bookinghomestay.app.infrastructure.file.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HostCreateServiceCommandHandler {
    private final IServiceRepository serviceRepository;
    private final FileStorageService fileStorageService;
    private final IHomestayRepository homestayRepository;

    public void handle(HostServiceCreateRequestDto command, String hostId) {
        String serviceid = serviceRepository.findAllServices().stream()
                .filter(s -> s.getTenDV().equalsIgnoreCase(command.getName())
                        && s.getHomestay().getIdHomestay().equalsIgnoreCase(command.getHomestayId()))
                .map(s -> s.getMaDV())
                .findFirst()
                .orElse(null);
        if (serviceid != null) {
            throw new RuntimeException("Dịch vụ với tên này đã tồn tại trong homestay của bạn !");
        }
        var homestay = homestayRepository.findById(command.getHomestayId())
                .orElseThrow(() -> new RuntimeException("Homestay không tồn tại !"));
        var service = new DichVu();
        service.setMaDV("SV-" + UUID.randomUUID().toString().substring(0, 7));
        service.setTenDV(command.getName());
        service.setMoTa(command.getDescription());
        service.setDonGia(BigDecimal.valueOf(command.getPrice()));
        service.setHomestay(homestay);
        try {
            String imageUrl = fileStorageService.storeService(command.getImage(), "services-");
            service.setHinhAnh(imageUrl);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi xử lý hình ảnh dịch vụ !");
        }
        try {
            serviceRepository.createService(service);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo dịch vụ !" + e.toString());
        }

    }
}
