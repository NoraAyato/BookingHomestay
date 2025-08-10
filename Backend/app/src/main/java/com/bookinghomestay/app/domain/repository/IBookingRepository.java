package com.bookinghomestay.app.domain.repository;

import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.model.PhieuHuyPhong;

import java.util.List;
import java.util.Optional;

public interface IBookingRepository {

    PhieuDatPhong create(PhieuDatPhong booking);

    PhieuDatPhong save(PhieuDatPhong booking);

    void delete(String bookingId);

    Optional<PhieuDatPhong> findById(String bookingId);

    boolean existsBookingForRoom(String maPhong, String trangThai,
            java.time.LocalDateTime ngayDen,
            java.time.LocalDateTime ngayDi);

    List<PhieuDatPhong> findPendingExpired(java.time.LocalDateTime cutoff);

    List<PhieuDatPhong> findByUserId(String userId);

    int countByUserIdAndTrangThai(String userId, String trangThai);

    Optional<PhieuHuyPhong> findCancelledBookingById(String bookingId);

    PhieuHuyPhong saveCancelledBooking(PhieuHuyPhong cancelledBooking);
}
