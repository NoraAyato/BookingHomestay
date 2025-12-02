package com.bookinghomestay.app.application.admin.homestay.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeleteHomestayCommandHandler {
    private final IHomestayRepository homestayRepository;

    public void handle(String id) {
        try {
            Homestay homestay = homestayRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("không tìm thấy homestay ! "));
            homestay.setTrangThai("inactive");
            homestayRepository.save(homestay);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi xóa homestay", e);
        }

    }
}
