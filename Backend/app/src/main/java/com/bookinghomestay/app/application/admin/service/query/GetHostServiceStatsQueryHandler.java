package com.bookinghomestay.app.application.admin.service.query;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.host.service.dto.HostServiceStatsResponse;
import com.bookinghomestay.app.domain.repository.IServiceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetHostServiceStatsQueryHandler {
    private final IServiceRepository serviceRepository;

    public HostServiceStatsResponse handle() {
        var allServices = serviceRepository.findAllServices();

        int totalServices = allServices.size();
        int approvedServices = (int) allServices.stream()
                .filter(service -> "APPROVED".equalsIgnoreCase(service.getTrangThai()))
                .count();
        int pendingServices = (int) allServices.stream()
                .filter(service -> "PENDING".equalsIgnoreCase(service.getTrangThai()))
                .count();
        int rejectedServices = (int) allServices.stream()
                .filter(service -> "REJECTED".equalsIgnoreCase(service.getTrangThai()))
                .count();

        return new HostServiceStatsResponse(totalServices, approvedServices, pendingServices, rejectedServices);
    }
}
