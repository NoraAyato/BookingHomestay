package com.bookinghomestay.app.domain.repository;

import java.util.Optional;

import com.bookinghomestay.app.domain.model.Phong;

public interface IPhongRepository {
    Optional<Phong> findById(String maPhong);

    void save(Phong phong);

    void delete(Phong phong);
}
