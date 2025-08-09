package com.bookinghomestay.app.domain.repository;

import java.util.Optional;

import com.bookinghomestay.app.domain.model.HoaDon;

public interface IInvoiceRepository {
    HoaDon create(HoaDon inv);

    HoaDon save(HoaDon inv);

    void delete(String maHd);

    Optional<HoaDon> findById(String maHd);

}
