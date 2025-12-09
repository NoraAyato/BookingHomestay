package com.bookinghomestay.app.infrastructure.persistence.repository.adapter;

import com.bookinghomestay.app.domain.model.TinTuc;
import com.bookinghomestay.app.domain.repository.INewsRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaNewsRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
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

    @Override
    public List<TinTuc> finAllOderByCreateTime(int limit) {
        return jpaNewsRepository.findAllOrderByCreateTimeDesc(PageRequest.of(0, limit));
    }

    @Override
    public void save(TinTuc tinTuc) {
        jpaNewsRepository.save(tinTuc);
    }

    @Override
    public void deleteById(String maTinTuc) {
        jpaNewsRepository.deleteById(maTinTuc);
    }

}
