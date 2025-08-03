package com.bookinghomestay.app.domain.repository;

import java.util.List;
import java.util.Optional;

import com.bookinghomestay.app.domain.model.KhuyenMai;

public interface IKhuyenMaiRepository {
    List<KhuyenMai> getAdminKm();

    Optional<KhuyenMai> getKhuyenMaiById(String id);

    KhuyenMai createKhuyenMai(KhuyenMai khuyenMai);

    KhuyenMai updateKhuyenMai(KhuyenMai khuyenMai);

    void deleteKhuyenMai(String id);

    List<KhuyenMai> getKhuyenMaiByUserId(String userId);
}
