package com.bookinghomestay.app.domain.repository;

import java.util.List;
import java.util.Optional;

import com.bookinghomestay.app.domain.model.Phong;

public interface IRoomRepository {
    List<Phong> getAll();

    Optional<Phong> getById(String maPhong);

    void save(Phong phong);

    void delete(String maPhong);
}
