package com.bookinghomestay.app.infrastructure.persistence.repository.jpa;

import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.KhuVuc;
import com.bookinghomestay.app.domain.model.Phong;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface JpaHomestayRepository extends JpaRepository<Homestay, String> {
        @Query("""
                        SELECT h FROM Homestay h
                        ORDER BY (
                            SELECT COALESCE(AVG((d.sachSe + d.tienIch + d.dichVu) / 3.0), 0)
                            FROM DanhGia d
                            WHERE d.homestay = h
                        ) DESC
                        """)
        List<Homestay> findTop5Homestays(Pageable pageable);

        @Query("SELECT h FROM Homestay h JOIN FETCH h.khuVuc")
        List<Homestay> findAllWithKhuVucJoined();

        @Query("""
                        SELECT p
                        FROM Phong p
                        WHERE p.homestay.idHomestay = :homestayId
                        AND NOT EXISTS (
                            SELECT c FROM ChiTietDatPhong c
                            JOIN c.phieuDatPhong pdp
                            WHERE c.phong.maPhong = p.maPhong
                            AND c.ngayDen < :ngayDi
                            AND c.ngayDi > :ngayDen
                            AND pdp.trangThai IN ('Booked', 'Pending')
                        )
                        """)
        List<Phong> findAvailableRoomsByHomestayId(
                        @Param("homestayId") String homestayId,
                        @Param("ngayDen") LocalDateTime ngayDen,
                        @Param("ngayDi") LocalDateTime ngayDi);

        @Query("SELECT DISTINCT h FROM Homestay h " +
                        "JOIN h.phongs p " +
                        "WHERE h.trangThai = 'Active' " +
                        "AND p.trangThai = 'Active' " +
                        "AND EXISTS (SELECT 1 FROM Phong p2 WHERE p2.homestay = h AND p2.trangThai = 'Active')")
        List<Homestay> findAllActiveWithActiveRooms();

        @Query("SELECT h FROM Homestay h WHERE (:search IS NULL OR :search = '' OR LOWER(h.tenHomestay) LIKE LOWER(CONCAT('%', :search, '%')))")
        Page<Homestay> findBySearch(@Param("search") String search, Pageable pageable);

        @Query("SELECT h FROM Homestay h WHERE h.nguoiDung.userId = :hostId")
        List<Homestay> findHomestaysByHostId(@Param("hostId") String hostId);
}
