package com.bookinghomestay.app.infrastructure.persistence.repository;

import com.bookinghomestay.app.domain.model.KhuyenMai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface JpaKhuyenMaiRepository extends JpaRepository<KhuyenMai, String> {
    @Query("SELECT k FROM KhuyenMai k WHERE k.apDungChoTatCaPhong = true")
    List<KhuyenMai> getAdminPromotions();
}