package com.bookinghomestay.app.infrastructure.persistence.repository;

import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.Phong;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface JpaHomestayRepository extends JpaRepository<Homestay, String> {
    List<Homestay> findTop5ByOrderByHangDesc();

    @Query("SELECT h FROM Homestay h JOIN FETCH h.khuVuc")
    List<Homestay> findAllWithKhuVucJoined();

    @Query("SELECT new com.bookinghomestay.app.domain.model.Phong(p.maPhong, p.tenPhong, p.trangThai, p.donGia, p.donGiaTheoGio, p.soNguoi, p.tour360) "
            +
            "FROM Phong p " +
            "WHERE p.homestay.idHomestay = :homestayId " +
            "AND NOT EXISTS (" +
            "SELECT c FROM ChiTietDatPhong c " +
            "JOIN c.phieuDatPhong pdp " +
            "WHERE c.phong.maPhong = p.maPhong " +
            "AND c.ngayDen < :ngayDi " +
            "AND c.ngayDi > :ngayDen " +
            "AND pdp.trangThai = ' Đãđặt')")
    List<Phong> findAvailableRoomsByHomestayId(@Param("homestayId") String homestayId,
            @Param("ngayDen") LocalDateTime ngayDen,
            @Param("ngayDi") LocalDateTime ngayDi);
}
