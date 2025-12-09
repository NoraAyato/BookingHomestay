package com.bookinghomestay.app.infrastructure.persistence.repository.adapter;

import java.lang.StackWalker.Option;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.bookinghomestay.app.domain.model.DichVuHs;
import com.bookinghomestay.app.domain.repository.IHomestayServiceRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaHomstayServiceRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class HomstayServiceRepositoryImpl implements IHomestayServiceRepository {
    private final JpaHomstayServiceRepository jpaHomstayServiceRepository;

    @Override
    public List<DichVuHs> getAllDichVuHs() {
        return jpaHomstayServiceRepository.findAll();
    }

    @Override
    public void save(DichVuHs dichVuHs) {
        jpaHomstayServiceRepository.save(dichVuHs);
    }

    @Override
    public Optional<DichVuHs> findById(String maDichVuHs) {
        return jpaHomstayServiceRepository.findById(maDichVuHs);
    }

    @Override
    public void deleteById(String maDichVuHs) {
        jpaHomstayServiceRepository.deleteById(maDichVuHs);
    }

}
