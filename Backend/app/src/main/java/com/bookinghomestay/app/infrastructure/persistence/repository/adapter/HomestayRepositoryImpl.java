package com.bookinghomestay.app.infrastructure.persistence.repository.adapter;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.bookinghomestay.app.application.homestay.dto.RoomDetailResponseDTO;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.KhuVuc;
import com.bookinghomestay.app.domain.model.Phong;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaHomestayRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaPhongRepository;

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
        return jpaRepo.findTop5Homestays(PageRequest.of(0, 5));
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

    @Override
    public Optional<RoomDetailResponseDTO> findPhongDetailById(String maPhong) {
        return jpaPhongRepository.findRoomDetailsByMaPhong(maPhong);
    }

    @Override
    public List<Homestay> getAllActiveHomestay() {
        return jpaRepo.findAllActiveWithActiveRooms();
    }

    @Override
    public Page<Homestay> findBySearch(String search, Pageable pageable) {
        return jpaRepo.findBySearch(search, pageable);
    }

    @Override
    public void save(Homestay homestay) {
        jpaRepo.save(homestay);
    }
}
