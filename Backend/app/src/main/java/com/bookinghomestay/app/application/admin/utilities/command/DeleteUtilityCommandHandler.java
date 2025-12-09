package com.bookinghomestay.app.application.admin.utilities.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.TienNghi;
import com.bookinghomestay.app.domain.repository.ITienNghiRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeleteUtilityCommandHandler {
    private final ITienNghiRepository tienNghiRepository;

    public void handle(String id) {
        try {

            TienNghi tn = tienNghiRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tiện nghi !"));
            if (tn.getChiTietPhongs() != null && tn.getChiTietPhongs().size() > 0) {
                throw new RuntimeException("Không thể xóa tiện nghi này vì homestay đang sử dụng tiện nghi này !");
            }
            tienNghiRepository.deleteById(tn.getMaTienNghi());
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi xóa tiện nghi: " + e.getMessage());
        }
    }
}
