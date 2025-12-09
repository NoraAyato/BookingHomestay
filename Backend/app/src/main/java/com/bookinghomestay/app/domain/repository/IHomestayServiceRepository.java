package com.bookinghomestay.app.domain.repository;

import java.util.List;
import java.util.Optional;

import com.bookinghomestay.app.domain.model.DichVuHs;

public interface IHomestayServiceRepository {
    List<DichVuHs> getAllDichVuHs();

    void save(DichVuHs dichVuHs);

    Optional<DichVuHs> findById(String maDichVuHs);

    void deleteById(String maDichVuHs);
}
