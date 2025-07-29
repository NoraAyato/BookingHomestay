package com.bookinghomestay.app.infrastructure.persistence.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class KhuyenMaiRepositoryImpl implements IKhuyenMaiRepository {

    @Autowired
    private JpaKhuyenMaiRepository jpaKhuyenMaiRepository;

    @Override
    public List<KhuyenMai> getAdminKm() {
        return jpaKhuyenMaiRepository.getAdminPromotions();
    }

}
