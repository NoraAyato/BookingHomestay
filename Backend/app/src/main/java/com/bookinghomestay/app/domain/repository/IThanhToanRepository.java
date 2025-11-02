package com.bookinghomestay.app.domain.repository;

import com.bookinghomestay.app.domain.model.ThanhToan;

import java.util.List;
import java.util.Optional;

public interface IThanhToanRepository {
    ThanhToan save(ThanhToan thanhToan);

    Optional<ThanhToan> findById(String id);

    Optional<ThanhToan> findByMaHoaDon(String maHoaDon);

    List<ThanhToan> findByMaHoaDonAndTrangThai(String maHoaDon, String trangThai);
}
