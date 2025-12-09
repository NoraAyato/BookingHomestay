package com.bookinghomestay.app.infrastructure.persistence.repository.adapter;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaKhuyenMaiRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class KhuyenMaiRepositoryImpl implements IKhuyenMaiRepository {

    @Autowired
    private JpaKhuyenMaiRepository jpaKhuyenMaiRepository;

    @Override
    public List<KhuyenMai> getAdminKm(int limit) {
        return jpaKhuyenMaiRepository
                .findTopByOrderByNgayTaoDesc(PageRequest.of(0, limit));
    }

    @Override
    public List<KhuyenMai> getAll() {
        return jpaKhuyenMaiRepository.findAll();
    }

    @Override
    public Optional<KhuyenMai> getKhuyenMaiById(String id) {
        return jpaKhuyenMaiRepository.findById(id);
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

    @Override
    public List<KhuyenMai> getAllAvailableKhuyenMai() {
        return jpaKhuyenMaiRepository.getAllAvailableKhuyenMai();
    }

    @Override
    public void save(KhuyenMai khuyenMai) {
        jpaKhuyenMaiRepository.save(khuyenMai);
    }

}
