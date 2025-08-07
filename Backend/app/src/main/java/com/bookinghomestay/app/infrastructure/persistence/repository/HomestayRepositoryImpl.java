package com.bookinghomestay.app.infrastructure.persistence.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.Phong;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;

import lombok.RequiredArgsConstructor;

import java.util.Optional;

@Repository
@RequiredArgsConstructor

public class HomestayRepositoryImpl implements IHomestayRepository {
    private final JpaHomestayRepository jpaRepo;
    private final JpaPhongRepository jpaPhongRepository;

    @Override
    public List<Homestay> getAll() {
        return jpaRepo.findAllWithKhuVucJoined();
    }

    @Override
    public List<Homestay> getTopRated() {
        return jpaRepo.findTop5ByOrderByHangDesc();
    }

    @Override
    public Optional<Homestay> findById(String id) {
        return jpaRepo.findById(id);
    }

    @Override
    public List<Phong> findAvailableRoomsByHomestayId(String homestayId, LocalDateTime ngayDen, LocalDateTime ngayDi) {
        return jpaRepo.findAvailableRoomsByHomestayId(homestayId, ngayDen, ngayDi);
    }

    @Override
    public Optional<Phong> findPhongById(String maPhong) {
        return jpaPhongRepository.findById(maPhong);
    }
}
