package com.bookinghomestay.app.infrastructure.persistence.repository.adapter;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.bookinghomestay.app.domain.model.DichVu;
import com.bookinghomestay.app.domain.repository.IServiceRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaServiceRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ServiceRepositoryImpl implements IServiceRepository {

    private final JpaServiceRepository jpaServiceRepository;

    @Override
    public List<DichVu> findAllServices() {
        return jpaServiceRepository.findAll();
    }

    @Override
    public Optional<DichVu> findServiceById(String serviceId) {
        return jpaServiceRepository.findById(serviceId);
    }

    @Override
    public DichVu createService(DichVu service) {
        return jpaServiceRepository.save(service);
    }

    @Override
    public DichVu updateService(DichVu service) {
        return jpaServiceRepository.save(service);
    }

    @Override
    public void deleteService(String serviceId) {
        jpaServiceRepository.deleteById(serviceId);
    }

}
