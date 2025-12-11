package com.bookinghomestay.app.application.host.homestay.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.repository.IHomestayRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeleteHostHomestayCommandHandler {
    private final IHomestayRepository homestayRepository;

    public void handle(String homestayId) {
        var homestay = homestayRepository.findById(homestayId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy homestay !"));
        homestay.setTrangThai("inactive");
        homestayRepository.save(homestay);
    }
}
