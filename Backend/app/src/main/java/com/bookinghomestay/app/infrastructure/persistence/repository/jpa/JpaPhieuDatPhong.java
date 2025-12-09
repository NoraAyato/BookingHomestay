package com.bookinghomestay.app.infrastructure.persistence.repository.jpa;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
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

  List<PhieuDatPhong> findByNguoiDung_UserId(String userId);

  @Query("""
          SELECT DISTINCT p
          FROM PhieuDatPhong p
          LEFT JOIN FETCH p.hoadon h
          LEFT JOIN FETCH h.thanhToans
      """)
  List<PhieuDatPhong> findAllWithHoaDonAndThanhToan();

  @Query("""
          SELECT DISTINCT p
          FROM PhieuDatPhong p
          LEFT JOIN FETCH p.nguoiDung u
          LEFT JOIN FETCH p.chiTietDatPhongs ctdp
          LEFT JOIN FETCH ctdp.phong phong
          LEFT JOIN FETCH phong.homestay hs
          LEFT JOIN FETCH p.hoadon h
          WHERE (:status IS NULL OR LOWER(p.trangThai) = LOWER(:status))
            AND (:startDate IS NULL OR CAST(p.ngayLap AS LocalDate) >= :startDate)
            AND (:endDate IS NULL OR CAST(p.ngayLap AS LocalDate) <= :endDate)
            AND (:keyword IS NULL OR
                 LOWER(p.maPDPhong) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                 LOWER(u.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                 LOWER(u.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                 LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                 LOWER(hs.tenHomestay) LIKE LOWER(CONCAT('%', :keyword, '%'))
                )
      """)
  Page<PhieuDatPhong> findBookingsByFilters(
      @Param("status") String status,
      @Param("startDate") LocalDate startDate,
      @Param("endDate") LocalDate endDate,
      @Param("keyword") String keyword,
      Pageable pageable);
}
