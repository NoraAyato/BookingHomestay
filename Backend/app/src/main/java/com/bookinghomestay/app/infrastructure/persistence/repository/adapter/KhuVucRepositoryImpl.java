package com.bookinghomestay.app.infrastructure.persistence.repository.adapter;

import com.bookinghomestay.app.domain.model.KhuVuc;
import com.bookinghomestay.app.domain.repository.IKhuVucRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaKhuVucRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class KhuVucRepositoryImpl implements IKhuVucRepository {
    private final JpaKhuVucRepository jpaRepo;

    @Override
    public List<KhuVuc> getAll() {
        return jpaRepo.findAll();
    }

    @Override
    public List<KhuVuc> getAllByHomestayCout(int limit) {
        return jpaRepo.findAllOrderByHomestayCountDesc(PageRequest.of(0, limit));
    }

    @Override
    public void save(KhuVuc khuVuc) {
        jpaRepo.save(khuVuc);
    }

    @Override
    public Optional<KhuVuc> findById(String id) {
        return jpaRepo.findById(id);
    }

    @Override
    public Page<KhuVuc> findBySearch(String search, Pageable pageable) {
        return jpaRepo.findBySearch(search, pageable);
    }
}
