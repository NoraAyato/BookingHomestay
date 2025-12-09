package com.bookinghomestay.app.application.admin.utilities.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.utilities.dto.UpdateUtilityRequestDto;
import com.bookinghomestay.app.domain.repository.ITienNghiRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UpdateUtilityCommandHandler {
    private final ITienNghiRepository tienNghiRepository;

    public void handle(UpdateUtilityRequestDto dto, String id) {
        // Lấy tiện nghi đang update
        var tienNghiOpt = tienNghiRepository.findById(id);
        if (tienNghiOpt.isEmpty()) {
            throw new IllegalArgumentException("Utility with id " + id + " not found.");
        }
        var tienNghi = tienNghiOpt.get();
        // Tìm tiện nghi khác đã tồn tại tên trùng
        var existing = tienNghiRepository.getAll().stream()
                .filter(t -> t.getTenTienNghi().equalsIgnoreCase(dto.getName()))
                .findFirst()
                .orElse(null);
        // Nếu tìm được tiện nghi trùng name nhưng id khác → báo lỗi
        if (existing != null && !existing.getMaTienNghi().equalsIgnoreCase(id)) {
            throw new RuntimeException("Tên tiện nghi đã tồn tại trong hệ thống.");
        }
        // Cập nhật
        tienNghi.setTenTienNghi(dto.getName());
        tienNghi.setMoTa(dto.getDescription());
        tienNghiRepository.save(tienNghi);
    }
}
