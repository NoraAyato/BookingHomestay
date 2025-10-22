package com.bookinghomestay.app.domain.repository;

import java.util.List;

import com.bookinghomestay.app.domain.model.TienNghi;

public interface ITienNghiRepository {
    List<TienNghi> getAll();
}
