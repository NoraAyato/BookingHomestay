package com.bookinghomestay.app.domain.repository;

import java.util.List;
import java.util.Optional;

import com.bookinghomestay.app.domain.model.DichVu;

public interface IServiceRepository {

    List<DichVu> findAllServices();

    Optional<DichVu> findServiceById(String serviceId);

    DichVu createService(DichVu service);

    DichVu updateService(DichVu service);

    void deleteService(String serviceId);
}
