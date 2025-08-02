package com.bookinghomestay.app.infrastructure.persistence.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import java.util.Optional;

@Repository
public class HomestayRepositoryImpl implements IHomestayRepository {
    private final JpaHomestayRepository jpaRepo;

    public HomestayRepositoryImpl(JpaHomestayRepository jpaRepo) {
        this.jpaRepo = jpaRepo;
    }

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
}
