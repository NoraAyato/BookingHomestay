package com.bookinghomestay.app.infrastructure.persistence.repository.adapter;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.bookinghomestay.app.domain.model.LoaiPhong;
import com.bookinghomestay.app.domain.repository.IRoomTypeRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaRoomTypeRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class RoomTypeRepositoryImpl implements IRoomTypeRepository {
    private final JpaRoomTypeRepository jpaRoomTypeRepository;

    @Override
    public Optional<LoaiPhong> findById(String maLoaiPhong) {
        return jpaRoomTypeRepository.findById(maLoaiPhong);

    }

    @Override
    public void save(LoaiPhong loaiPhong) {
        jpaRoomTypeRepository.save(loaiPhong);
    }

    @Override
    public void deleteById(String maLoaiPhong) {
        jpaRoomTypeRepository.deleteById(maLoaiPhong);
    }

    @Override
    public List<LoaiPhong> findAll() {
        return jpaRoomTypeRepository.findAll();
    }
}
