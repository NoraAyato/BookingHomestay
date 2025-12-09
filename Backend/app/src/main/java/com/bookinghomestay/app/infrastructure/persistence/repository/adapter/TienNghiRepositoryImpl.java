package com.bookinghomestay.app.infrastructure.persistence.repository.adapter;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.bookinghomestay.app.domain.model.TienNghi;
import com.bookinghomestay.app.domain.repository.ITienNghiRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaTienNghiRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class TienNghiRepositoryImpl implements ITienNghiRepository {
    private final JpaTienNghiRepository jpaTienNghiRepository;

    @Override
    public List<TienNghi> getAll() {
        return jpaTienNghiRepository.findAll();
    }

    @Override
    public void save(TienNghi tienNghi) {
        jpaTienNghiRepository.save(tienNghi);
    }

    @Override
    public void deleteById(String maTienNghi) {
        jpaTienNghiRepository.deleteById(maTienNghi);
    }

    @Override
    public Optional<TienNghi> findById(String maTienNghi) {
        return jpaTienNghiRepository.findById(maTienNghi);
    }

}
