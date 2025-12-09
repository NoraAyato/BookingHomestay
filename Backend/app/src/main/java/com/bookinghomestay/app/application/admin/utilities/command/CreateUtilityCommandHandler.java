package com.bookinghomestay.app.application.admin.utilities.command;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.utilities.dto.CreateUtilityRequestDto;
import com.bookinghomestay.app.domain.model.TienNghi;
import com.bookinghomestay.app.domain.repository.ITienNghiRepository;
import com.google.api.services.storage.Storage.Projects.HmacKeys.Create;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateUtilityCommandHandler {
    private final ITienNghiRepository tienNghiRepository;

    public void handle(CreateUtilityRequestDto command) {
        try {
            boolean exists = tienNghiRepository.getAll().stream()
                    .anyMatch(tienNghi -> tienNghi.getTenTienNghi().equalsIgnoreCase(command.getName()));
            if (exists) {
                throw new RuntimeException("Tiện nghi đã tồn tại trong hệ thống.");
            }

            var tienNghi = new TienNghi();
            tienNghi.setMaTienNghi("TN-" + UUID.randomUUID().toString().substring(0, 7));
            tienNghi.setTenTienNghi(command.getName());
            tienNghi.setMoTa(command.getDescription());
            tienNghiRepository.save(tienNghi);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo tiện nghi: " + e.getMessage());
        }

    }
}
