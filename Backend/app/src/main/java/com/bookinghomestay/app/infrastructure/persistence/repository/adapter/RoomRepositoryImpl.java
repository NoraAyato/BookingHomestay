package com.bookinghomestay.app.infrastructure.persistence.repository.adapter;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.bookinghomestay.app.domain.model.Phong;
import com.bookinghomestay.app.domain.repository.IRoomRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaPhongRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class RoomRepositoryImpl implements IRoomRepository {
    private final JpaPhongRepository jpaPhongRepository;

    @Override
    public List<Phong> getAll() {
        return jpaPhongRepository.findAll();
    }

    @Override
    public Optional<Phong> getById(String maPhong) {
        return jpaPhongRepository.findById(maPhong);
    }

    @Override
    public void save(Phong phong) {
        jpaPhongRepository.save(phong);
    }

    @Override
    public void delete(String maPhong) {
        jpaPhongRepository.deleteById(maPhong);
    }

}
