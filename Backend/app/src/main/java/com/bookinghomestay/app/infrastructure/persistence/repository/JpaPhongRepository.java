package com.bookinghomestay.app.infrastructure.persistence.repository;

import com.bookinghomestay.app.api.dto.homestay.RoomDetailResponseDTO;
import com.bookinghomestay.app.domain.model.Phong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface JpaPhongRepository extends JpaRepository<Phong, String> {

    @Query("SELECT new com.bookinghomestay.app.api.dto.homestay.RoomDetailResponseDTO(p.maPhong,p.tenPhong,p.soNguoi, lp.tenLoai, p.donGia, cs.nhanPhong, cs.traPhong, cs.huyPhong) "
            +
            "FROM Phong p " +
            "JOIN p.loaiPhong lp " +
            "JOIN p.homestay h " +
            "JOIN h.chinhSachs cs " +
            "WHERE p.maPhong = :maPhong " +
            "AND cs.maCS = (SELECT MIN(cs2.maCS) FROM ChinhSach cs2 WHERE cs2.homestay = h)")
    Optional<RoomDetailResponseDTO> findRoomDetailsByMaPhong(@Param("maPhong") String maPhong);
}