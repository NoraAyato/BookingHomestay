package com.bookinghomestay.app.domain.repository;

import java.time.LocalDateTime;
import java.util.List;

import com.bookinghomestay.app.application.homestay.dto.RoomDetailResponseDTO;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.KhuVuc;
import com.bookinghomestay.app.domain.model.Phong;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IHomestayRepository {
    List<Homestay> getAll();

    List<Homestay> getAllActiveHomestay();

    List<Homestay> getTopRated();

    List<Homestay> getHomestayByHostId(String hostId);

    void save(Homestay homestay);

    Optional<Homestay> findById(String id);

    Page<Homestay> findBySearch(String search, Pageable pageable);

    List<Phong> findAvailableRoomsByHomestayId(String homestayId, LocalDateTime ngayDen, LocalDateTime ngayDi);

    Optional<Phong> findPhongById(String maPhong);

    Optional<RoomDetailResponseDTO> findPhongDetailById(String maPhong);

}
