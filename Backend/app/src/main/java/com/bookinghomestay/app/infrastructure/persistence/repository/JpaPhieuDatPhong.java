package com.bookinghomestay.app.infrastructure.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface JpaPhieuDatPhong extends JpaRepository<PhieuDatPhong, String> {
  @Query("""
          SELECT CASE WHEN COUNT(ctdp) > 0 THEN true ELSE false END
          FROM ChiTietDatPhong ctdp
          JOIN ctdp.phieuDatPhong pdp
          WHERE ctdp.maPhong = :maPhong
            AND pdp.trangThai = :trangThai
            AND (
                  (ctdp.ngayDen < :ngayDi AND ctdp.ngayDi > :ngayDen)
                )
      """)
  boolean existsBookingOverlap(String maPhong, String trangThai, LocalDateTime ngayDen, LocalDateTime ngayDi);

  @Query("""
          SELECT DISTINCT p
          FROM PhieuDatPhong p
          LEFT JOIN FETCH p.chiTietDatPhongs
          WHERE p.trangThai = 'Pending'
            AND p.ngayLap < :cutoff
      """)
  List<PhieuDatPhong> findPendingExpired(@Param("cutoff") LocalDateTime cutoff);

  int countByNguoiDung_UserIdAndTrangThai(String userId, String trangThai);
}
