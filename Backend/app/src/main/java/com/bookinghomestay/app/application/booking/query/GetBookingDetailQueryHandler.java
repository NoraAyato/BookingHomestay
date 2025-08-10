package com.bookinghomestay.app.application.booking.query;

import com.bookinghomestay.app.api.dto.booking.BookingDetailResponseDto;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetBookingDetailQueryHandler {
    private final IBookingRepository bookingRepository;

    public BookingDetailResponseDto handle(GetBookingDetailQuery query) {
        var bookingOpt = bookingRepository.findById(query.getBookingId());
        if (bookingOpt.isEmpty())
            return null;
        var booking = bookingOpt.get();
        var chiTiet = booking.getChiTietDatPhongs().get(0);
        var phong = chiTiet.getPhong();
        var homestay = phong.getHomestay();
        var user = booking.getNguoiDung();
        var hinhAnhChinh = phong.getHinhAnhPhongs().stream()
                .filter(h -> h.isLaAnhChinh())
                .findFirst()
                .map(h -> h.getUrlAnh())
                .orElse(null);
        long soNgay = java.time.temporal.ChronoUnit.DAYS.between(
                chiTiet.getNgayDen().toLocalDate(),
                chiTiet.getNgayDi().toLocalDate());

        BigDecimal tongTien;
        if (booking.getHoadon() != null) {
            tongTien = booking.getHoadon().getTongTien();
        } else {
            BigDecimal giaPhong = chiTiet.getPhong().getDonGia();
            tongTien = giaPhong.multiply(BigDecimal.valueOf(soNgay));
        }
        BookingDetailResponseDto dto = new BookingDetailResponseDto();
        dto.setMaPDPhong(booking.getMaPDPhong());
        dto.setMaHomestay(homestay.getIdHomestay());
        dto.setTenHomestay(homestay.getTenHomestay());
        dto.setDiaChiHomestay(homestay.getDiaChi());
        dto.setTenLoaiPhong(phong.getLoaiPhong().getTenLoai());
        dto.setTenPhong(phong.getTenPhong());
        dto.setHinhAnhPhong(hinhAnhChinh);
        dto.setUserName(user.getUserName());
        dto.setSoDienThoai(user.getPhoneNumber());
        dto.setTongTienPhong(tongTien);
        dto.setChinhSachHuyPhong(homestay.getChinhSachs().get(0).getHuyPhong());
        dto.setChinhSachNhanPhong(homestay.getChinhSachs().get(0).getNhanPhong());
        dto.setChinhSachTraPhong(homestay.getChinhSachs().get(0).getTraPhong());
        dto.setNgayNhanPhong(chiTiet.getNgayDen().toLocalDate().toString());
        dto.setNgayTraPhong(chiTiet.getNgayDi().toLocalDate().toString());
        dto.setDichVuSuDung(
                chiTiet.getChiTietDichVus().stream()
                        .map(dv -> dv.getDichVu().getTenDV())
                        .toList());
        return dto;
    }
}