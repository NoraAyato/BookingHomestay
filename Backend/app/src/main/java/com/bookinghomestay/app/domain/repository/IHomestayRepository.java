package com.bookinghomestay.app.domain.repository;

import java.time.LocalDateTime;
import java.util.List;

import com.bookinghomestay.app.api.dto.homestay.RoomDetailResponseDTO;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.Phong;

import java.util.Optional;

public interface IHomestayRepository {
    List<Homestay> getAll();

    List<Homestay> getAllActiveHomestay();

    List<Homestay> getTopRated();

    Optional<Homestay> findById(String id);

    List<Phong> findAvailableRoomsByHomestayId(String homestayId, LocalDateTime ngayDen, LocalDateTime ngayDi);

    Optional<Phong> findPhongById(String maPhong);

    Optional<RoomDetailResponseDTO> findPhongDetailById(String maPhong);

}
