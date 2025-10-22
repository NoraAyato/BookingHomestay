package com.bookinghomestay.app.infrastructure.persistence.repository;

import com.bookinghomestay.app.domain.model.KhuyenMai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface JpaKhuyenMaiRepository extends JpaRepository<KhuyenMai, String> {

    @Query("SELECT k FROM KhuyenMai k WHERE k.apDungChoTatCaPhong = true AND k.ngayKetThuc > CURRENT_TIMESTAMP")
    List<KhuyenMai> getAllAvailableKhuyenMai();

    @Query("""
            SELECT DISTINCT km FROM KhuyenMai km
            LEFT JOIN km.khuyenMaiPhongs kmp
            WHERE km.apDungChoTatCaPhong = true
               OR kmp.phong.maPhong = :maPhong
            """)
    List<KhuyenMai> getAllPromotionsForRoom(String maPhong);

}