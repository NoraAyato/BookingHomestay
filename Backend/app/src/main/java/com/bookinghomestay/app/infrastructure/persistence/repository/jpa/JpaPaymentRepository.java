package com.bookinghomestay.app.infrastructure.persistence.repository.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bookinghomestay.app.domain.model.ThanhToan;

public interface JpaPaymentRepository extends JpaRepository<ThanhToan, String> {
    List<ThanhToan> findByHoaDon_MaHD(String maHD);
}
