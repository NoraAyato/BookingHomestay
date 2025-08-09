package com.bookinghomestay.app.infrastructure.persistence.repository;

import java.util.List;
import java.util.Optional;

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

    @Override
    public Optional<KhuyenMai> getKhuyenMaiById(String id) {
        return jpaKhuyenMaiRepository.findById(id);
    }

    @Override
    public KhuyenMai createKhuyenMai(KhuyenMai khuyenMai) {
        return jpaKhuyenMaiRepository.save(khuyenMai);
    }

    @Override
    public KhuyenMai updateKhuyenMai(KhuyenMai khuyenMai) {
        return jpaKhuyenMaiRepository.save(khuyenMai);
    }

    @Override
    public void deleteKhuyenMai(String id) {
        if (!jpaKhuyenMaiRepository.existsById(id)) {
            throw new RuntimeException("Khuyến mãi không tồn tại !");
        }
        jpaKhuyenMaiRepository.deleteById(id);
    }

    @Override
    public List<KhuyenMai> getKhuyenMaiByUserId(String userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getKhuyenMaiByUserId'");
    }

    @Override
    public List<KhuyenMai> getAllPromotionsForRoom(String maPhong) {
        return jpaKhuyenMaiRepository.getAllPromotionsForRoom(maPhong);
    }

}
