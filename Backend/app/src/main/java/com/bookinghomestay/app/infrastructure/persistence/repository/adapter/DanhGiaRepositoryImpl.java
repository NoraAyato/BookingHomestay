// File: DanhGiaRepositoryImpl.java
package com.bookinghomestay.app.infrastructure.persistence.repository.adapter;

import com.bookinghomestay.app.domain.model.DanhGia;
import com.bookinghomestay.app.domain.repository.IReviewRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaDanhGiaRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class DanhGiaRepositoryImpl implements IReviewRepository {

    private final JpaDanhGiaRepository jpaDanhGiaRepository;

    @Override
    public List<DanhGia> findByHomestay_IdHomestay(String homestayId) {
        return jpaDanhGiaRepository.findByHomestay_IdHomestay(homestayId);
    }

    @Override
    public int countByHomestayId(String homestayId) {
        return jpaDanhGiaRepository.countByHomestayId(homestayId);
    }

    @Override
    public Double averageHaiLongByHomestayId(String homestayId) {
        return jpaDanhGiaRepository.averageDichVuByHomestayId(homestayId);
    }

    @Override
    public DanhGia save(DanhGia danhGia) {
        return jpaDanhGiaRepository.save(danhGia);
    }

    @Override
    public DanhGia remove(DanhGia danhGia) {
        jpaDanhGiaRepository.delete(danhGia);
        return danhGia;
    }

    @Override
    public Optional<DanhGia> findByIdHomestayAndBookingId(String homestayId, String bookingId) {
        return jpaDanhGiaRepository.findByIdHomestayAndBookingId(homestayId, bookingId);
    }

}
