package com.bookinghomestay.app.infrastructure.persistence.repository.adapter;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.bookinghomestay.app.domain.model.Phong;
import com.bookinghomestay.app.domain.repository.IPhongRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaPhongRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PhongRepositoryImpl implements IPhongRepository {
    private final JpaPhongRepository jpaPhongRepository;

    @Override
    public Optional<Phong> findById(String maPhong) {
        return jpaPhongRepository.findById(maPhong);
    }

    @Override
    public void save(Phong phong) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'save'");
    }

    @Override
    public void delete(Phong phong) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'delete'");
    }

}
