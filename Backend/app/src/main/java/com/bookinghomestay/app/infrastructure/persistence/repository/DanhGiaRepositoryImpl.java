// File: DanhGiaRepositoryImpl.java
package com.bookinghomestay.app.infrastructure.persistence.repository;

import com.bookinghomestay.app.domain.model.DanhGia;
import com.bookinghomestay.app.domain.repository.IDanhGiaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class DanhGiaRepositoryImpl implements IDanhGiaRepository {

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
        return jpaDanhGiaRepository.averageHaiLongByHomestayId(homestayId);
    }

}
