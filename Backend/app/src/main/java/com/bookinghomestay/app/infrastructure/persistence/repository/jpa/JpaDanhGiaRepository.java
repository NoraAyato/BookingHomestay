package com.bookinghomestay.app.infrastructure.persistence.repository.jpa;

import com.bookinghomestay.app.domain.model.DanhGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JpaDanhGiaRepository extends JpaRepository<DanhGia, String> {
    List<DanhGia> findByHomestay_IdHomestay(String homestayId);

    @Query("SELECT COUNT(d) FROM DanhGia d WHERE d.homestay.idHomestay = :homestayId")
    int countByHomestayId(@Param("homestayId") String homestayId);

    @Query("SELECT AVG(d.dichVu) FROM DanhGia d WHERE d.homestay.idHomestay = :homestayId")
    Double averageDichVuByHomestayId(@Param("homestayId") String homestayId);

}
