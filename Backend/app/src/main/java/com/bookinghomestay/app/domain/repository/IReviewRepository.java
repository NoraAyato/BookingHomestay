// File: IDanhGiaRepository.java
package com.bookinghomestay.app.domain.repository;

import com.bookinghomestay.app.domain.model.DanhGia;

import java.lang.StackWalker.Option;
import java.util.List;
import java.util.Optional;

public interface IReviewRepository {
    List<DanhGia> findByHomestay_IdHomestay(String homestayId);

    Optional<DanhGia> findById(String reviewId);

    List<DanhGia> getAll();

    Optional<DanhGia> findByIdHomestayAndBookingId(String homestayId, String bookingId);

    int countByHomestayId(String homestayId);

    Double averageHaiLongByHomestayId(String homestayId);

    DanhGia save(DanhGia danhGia);

    void deleteById(String reviewId);

    List<DanhGia> findBestReviewPerTop5Locations();
}
