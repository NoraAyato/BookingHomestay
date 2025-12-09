package com.bookinghomestay.app.domain.repository;

import java.util.List;
import java.util.Optional;

import com.bookinghomestay.app.domain.model.LoaiPhong;

public interface IRoomTypeRepository {
    Optional<LoaiPhong> findById(String maLoaiPhong);

    void save(LoaiPhong loaiPhong);

    List<LoaiPhong> findAll();

    void deleteById(String maLoaiPhong);
}
