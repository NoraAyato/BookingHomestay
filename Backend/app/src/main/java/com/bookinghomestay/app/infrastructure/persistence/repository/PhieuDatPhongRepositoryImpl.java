package com.bookinghomestay.app.infrastructure.persistence.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.repository.IBookingRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PhieuDatPhongRepositoryImpl implements IBookingRepository {
    private final JpaPhieuDatPhong jpaPhieuDatPhong;

    @Override
    public PhieuDatPhong create(PhieuDatPhong booking) {
        return jpaPhieuDatPhong.save(booking);
    }

    @Override
    public PhieuDatPhong save(PhieuDatPhong booking) {
        return jpaPhieuDatPhong.save(booking);
    }

    @Override
    public void delete(String bookingId) {
        jpaPhieuDatPhong.deleteById(bookingId);
    }

    @Override
    public Optional<PhieuDatPhong> findById(String bookingId) {
        return jpaPhieuDatPhong.findById(bookingId);
    }

    @Override
    public boolean existsBookingForRoom(String maPhong, String trangThai, LocalDateTime ngayDen, LocalDateTime ngayDi) {
        return jpaPhieuDatPhong.existsBookingOverlap(maPhong, trangThai, ngayDen, ngayDi);
    }

    @Override
    public List<PhieuDatPhong> findPendingExpired(LocalDateTime cutoff) {
        return jpaPhieuDatPhong.findPendingExpired(cutoff);
    }

    @Override
    public int countByUserIdAndTrangThai(String userId, String trangThai) {
        return jpaPhieuDatPhong.countByNguoiDung_UserIdAndTrangThai(userId, trangThai);
    }
}
