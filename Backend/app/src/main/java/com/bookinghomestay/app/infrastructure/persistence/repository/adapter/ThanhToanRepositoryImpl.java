package com.bookinghomestay.app.infrastructure.persistence.repository.adapter;

import com.bookinghomestay.app.domain.model.ThanhToan;
import com.bookinghomestay.app.domain.repository.IThanhToanRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaThanhToanRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ThanhToanRepositoryImpl implements IThanhToanRepository {

    private final JpaThanhToanRepository jpaThanhToanRepository;

    @Override
    public ThanhToan save(ThanhToan thanhToan) {
        return jpaThanhToanRepository.save(thanhToan);
    }

    @Override
    public Optional<ThanhToan> findById(String id) {
        return jpaThanhToanRepository.findById(id);
    }

    @Override
    public Optional<ThanhToan> findByMaHoaDon(String maHoaDon) {
        return jpaThanhToanRepository.findByMaHoaDon(maHoaDon);
    }

    @Override
    public List<ThanhToan> findByMaHoaDonAndTrangThai(String maHoaDon, String trangThai) {
        return jpaThanhToanRepository.findByMaHoaDonAndTrangThai(maHoaDon, trangThai);
    }
}
