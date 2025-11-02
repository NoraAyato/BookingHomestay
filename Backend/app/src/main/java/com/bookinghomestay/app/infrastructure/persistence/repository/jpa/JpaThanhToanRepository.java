package com.bookinghomestay.app.infrastructure.persistence.repository.jpa;

import com.bookinghomestay.app.domain.model.ThanhToan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JpaThanhToanRepository extends JpaRepository<ThanhToan, String> {

    @Query("SELECT t FROM ThanhToan t WHERE t.hoaDon.maHD = :maHoaDon")
    Optional<ThanhToan> findByMaHoaDon(@Param("maHoaDon") String maHoaDon);

    @Query("SELECT t FROM ThanhToan t WHERE t.hoaDon.maHD = :maHoaDon AND t.trangThai = :trangThai")
    List<ThanhToan> findByMaHoaDonAndTrangThai(@Param("maHoaDon") String maHoaDon,
            @Param("trangThai") String trangThai);
}
