package com.bookinghomestay.app.application.host.service.query;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.repository.IHomestayServiceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetServiceSuggestListHandler {
    private final IHomestayServiceRepository homestayServiceRepository;

    public List<String> handle() {
        List<String> serviceNames = homestayServiceRepository.getAllDichVuHs()
                .stream()
                .map(dichVuHs -> dichVuHs.getTenDichVuHomestay()).distinct()
                .toList();
        return serviceNames;
    }
}
