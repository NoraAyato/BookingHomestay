package com.bookinghomestay.app.domain.repository;

import java.util.List;

import com.bookinghomestay.app.domain.model.KhuyenMai;

public interface IKhuyenMaiRepository {
    List<KhuyenMai> getAdminKm();
}
