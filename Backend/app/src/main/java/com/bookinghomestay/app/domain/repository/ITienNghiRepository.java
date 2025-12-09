package com.bookinghomestay.app.domain.repository;

import java.util.List;
import java.util.Optional;

import com.bookinghomestay.app.domain.model.TienNghi;

public interface ITienNghiRepository {
    List<TienNghi> getAll();

    void save(TienNghi tienNghi);

    void deleteById(String maTienNghi);

    Optional<TienNghi> findById(String maTienNghi);
}
