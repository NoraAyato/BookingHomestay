package com.bookinghomestay.app.application.booking.query;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.api.dto.booking.BookingListResponseDto;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.repository.IBookingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetBookingListQueryHandler {
    private final IBookingRepository bookingRepository;

    public List<BookingListResponseDto> handle(GetBookingListQuery query) {
        List<PhieuDatPhong> bookings = bookingRepository.findByUserId(query.getUserId());

        return bookings.stream()
                .map(booking -> {
                    BookingListResponseDto dto = new BookingListResponseDto();
                    dto.setMaPDPhong(booking.getMaPDPhong());
                    dto.setNgayLap(booking.getNgayLap());
                    dto.setTrangThai(booking.getTrangThai());

                    if (booking.getChiTietDatPhongs() != null && !booking.getChiTietDatPhongs().isEmpty()) {
                        var chiTiet = booking.getChiTietDatPhongs().get(0);
                        var phong = chiTiet.getPhong();

                        if (phong != null) {
                            dto.setTenPhong(phong.getTenPhong());
                            if (phong.getHomestay() != null) {
                                dto.setTenHomestay(phong.getHomestay().getTenHomestay());
                            }
                        }
                    }

                    if (booking.getHoadon() != null) {
                        dto.setTongTien(booking.getHoadon().getTongTien());
                    } else if (booking.getChiTietDatPhongs() != null && !booking.getChiTietDatPhongs().isEmpty()) {
                        // Tính tổng tiền khi không có hóa đơn
                        var chiTiet = booking.getChiTietDatPhongs().get(0);
                        var phong = chiTiet.getPhong();

                        // Tính số ngày lưu trú
                        long soNgayLuuTru = ChronoUnit.DAYS.between(
                                chiTiet.getNgayDen().toLocalDate(),
                                chiTiet.getNgayDi().toLocalDate());

                        // Tính tiền phòng * số ngày
                        BigDecimal tongTienPhong = phong.getDonGia().multiply(BigDecimal.valueOf(soNgayLuuTru));

                        // Tính tiền dịch vụ * số ngày (nếu có)
                        BigDecimal tongTienDichVu = BigDecimal.ZERO;
                        if (chiTiet.getChiTietDichVus() != null) {
                            for (var dichVu : chiTiet.getChiTietDichVus()) {
                                tongTienDichVu = tongTienDichVu.add(
                                        dichVu.getDichVu().getDonGia().multiply(BigDecimal.valueOf(soNgayLuuTru)));
                            }
                        }

                        // Tổng tiền = tiền phòng + tiền dịch vụ
                        dto.setTongTien(tongTienPhong.add(tongTienDichVu));
                    }

                    return dto;
                })
                .collect(Collectors.toList());
    }
}
