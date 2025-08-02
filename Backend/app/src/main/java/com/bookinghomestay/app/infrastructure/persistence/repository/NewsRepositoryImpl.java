package com.bookinghomestay.app.infrastructure.persistence.repository;

import com.bookinghomestay.app.domain.model.TinTuc;
import com.bookinghomestay.app.domain.repository.INewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class NewsRepositoryImpl implements INewsRepository {

    private final JpaNewsRepository jpaNewsRepository;

    @Override
    public List<TinTuc> findAll() {
        return jpaNewsRepository.findAll();
    }

    @Override
    public Optional<TinTuc> findById(String maTinTuc) {
        return jpaNewsRepository.findById(maTinTuc);
    }

    @Override
    public List<TinTuc> findAllPublished() {
        return jpaNewsRepository.findAllPublished();
    }

}
