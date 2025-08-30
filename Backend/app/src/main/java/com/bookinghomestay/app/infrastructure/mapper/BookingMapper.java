package com.bookinghomestay.app.infrastructure.mapper;

import com.bookinghomestay.app.api.dto.booking.BookingDetailResponseDto;
import com.bookinghomestay.app.api.dto.booking.MyBookingListResponseDto;
import com.bookinghomestay.app.api.dto.booking.BookingPaymentResponseDto;
import com.bookinghomestay.app.domain.model.HoaDon;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;
import java.util.ArrayList;

public class BookingMapper {
    public static MyBookingListResponseDto toMyBookingListResponseDto(PhieuDatPhong booking,
            BigDecimal tongTien) {
        MyBookingListResponseDto dto = new MyBookingListResponseDto();
        dto.setId(booking.getMaPDPhong());
        dto.setBookingDate(booking.getNgayLap().toString());
        dto.setTotalPrice(tongTien);
        dto.setStatus(booking.getTrangThai());
        dto.setRooms(new ArrayList<>());
        if (booking.getChiTietDatPhongs() != null && !booking.getChiTietDatPhongs().isEmpty()) {
            var chiTiet = booking.getChiTietDatPhongs();
            for (var item : chiTiet) {
                var room = new MyBookingListResponseDto.Room();
                room.setId(item.getMaPDPhong());
                room.setCheckIn(item.getNgayDen().toLocalDate().toString());
                room.setCheckOut(item.getNgayDi().toLocalDate().toString());
                room.setHomestay(item.getPhong().getHomestay().getTenHomestay());
                room.setLocation(item.getPhong().getHomestay().getDiaChi() + ", "
                        + item.getPhong().getHomestay().getKhuVuc().getTenKv());
                room.setPrice(item.getPhong().getDonGia());
                room.setImage(item.getPhong().getHinhAnhPhongs().stream()
                        .filter(h -> h.isLaAnhChinh())
                        .findFirst()
                        .map(h -> h.getUrlAnh())
                        .orElse(""));
                room.setRoomType(item.getPhong().getLoaiPhong().getTenLoai());
                room.setServices(item.getChiTietDichVus().stream()
                        .map(dv -> {
                            var service = new MyBookingListResponseDto.Room.Service();
                            service.setId(dv.getDichVu().getMaDV());
                            service.setName(dv.getDichVu().getTenDV());
                            service.setPrice(dv.getDichVu().getDonGia());
                            return service;
                        })
                        .collect(Collectors.toList()));
                dto.getRooms().add(room);
            }

        }

        return dto;
    }

    public static BookingDetailResponseDto toBookingDetailResponseDto(PhieuDatPhong booking) {
        if (booking == null || booking.getChiTietDatPhongs() == null || booking.getChiTietDatPhongs().isEmpty()) {
            return null;
        }

        var chiTiet = booking.getChiTietDatPhongs().get(0);
        var phong = chiTiet.getPhong();
        var homestay = phong.getHomestay();
        var user = booking.getNguoiDung();

        var hinhAnhChinh = phong.getHinhAnhPhongs().stream()
                .filter(h -> h.isLaAnhChinh())
                .findFirst()
                .map(h -> h.getUrlAnh())
                .orElse(null);

        long soNgay = ChronoUnit.DAYS.between(
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

        if (homestay.getChinhSachs() != null && !homestay.getChinhSachs().isEmpty()) {
            dto.setChinhSachHuyPhong(homestay.getChinhSachs().get(0).getHuyPhong());
            dto.setChinhSachNhanPhong(homestay.getChinhSachs().get(0).getNhanPhong());
            dto.setChinhSachTraPhong(homestay.getChinhSachs().get(0).getTraPhong());
        }

        dto.setNgayNhanPhong(chiTiet.getNgayDen().toLocalDate().toString());
        dto.setNgayTraPhong(chiTiet.getNgayDi().toLocalDate().toString());

        if (chiTiet.getChiTietDichVus() != null) {
            dto.setDichVuSuDung(
                    chiTiet.getChiTietDichVus().stream()
                            .map(dv -> dv.getDichVu().getTenDV())
                            .collect(Collectors.toList()));
        }

        return dto;
    }

    public static BookingPaymentResponseDto toBookingPaymentResponseDto(PhieuDatPhong booking) {
        if (booking == null || booking.getHoadon() == null) {
            return null;
        }

        HoaDon hoaDon = booking.getHoadon();

        return new BookingPaymentResponseDto(
                booking.getMaPDPhong(),
                hoaDon.getMaHD(),
                hoaDon.getTongTien(),
                hoaDon.getTrangThai());
    }
}
