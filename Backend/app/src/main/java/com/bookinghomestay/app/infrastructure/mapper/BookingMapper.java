package com.bookinghomestay.app.infrastructure.mapper;

import com.bookinghomestay.app.application.admin.booking.dto.BookingDataResponseDto;
import com.bookinghomestay.app.application.booking.dto.booking.BookingDetailResponseDto;
import com.bookinghomestay.app.application.booking.dto.booking.BookingPaymentResponseDto;
import com.bookinghomestay.app.application.booking.dto.booking.BookingResponseDto;
import com.bookinghomestay.app.application.host.bookings.dto.BookedRoom;
import com.bookinghomestay.app.application.host.bookings.dto.HostBookingDataResponseDto;
import com.bookinghomestay.app.domain.model.HoaDon;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.List;

public class BookingMapper {

    public static BookingDataResponseDto toBookingDataResponse(PhieuDatPhong booking, BigDecimal totalAmount) {
        BookingDataResponseDto dto = new BookingDataResponseDto();

        dto.setId(booking.getMaPDPhong());

        // Thông tin khách hàng
        if (booking.getNguoiDung() != null) {
            String fullName = (booking.getNguoiDung().getFirstName() != null
                    ? booking.getNguoiDung().getFirstName()
                    : "")
                    + " " + (booking.getNguoiDung().getLastName() != null
                            ? booking.getNguoiDung().getLastName()
                            : "");
            dto.setGuestName(fullName.trim());
            dto.setGuestEmail(booking.getNguoiDung().getEmail());
            dto.setGuestPhone(booking.getNguoiDung().getPhoneNumber());
        }

        // Lấy thông tin homestay và ngày check in/out từ chi tiết đặt phòng
        if (booking.getChiTietDatPhongs() != null && !booking.getChiTietDatPhongs().isEmpty()) {
            var chiTiet = booking.getChiTietDatPhongs().get(0);
            if (chiTiet.getNgayDen() != null) {
                dto.setCheckIn(chiTiet.getNgayDen().toLocalDate());
            }
            if (chiTiet.getNgayDi() != null) {
                dto.setCheckOut(chiTiet.getNgayDi().toLocalDate());
            }

            // Lấy thông tin homestay
            if (chiTiet.getPhong() != null && chiTiet.getPhong().getHomestay() != null) {
                dto.setHomestay(chiTiet.getPhong().getHomestay().getTenHomestay());
                // Lấy thông tin chủ nhà nếu có
                if (chiTiet.getPhong().getHomestay().getNguoiDung() != null) {
                    String hostName = (chiTiet.getPhong().getHomestay().getNguoiDung()
                            .getFirstName() != null
                                    ? chiTiet.getPhong().getHomestay()
                                            .getNguoiDung()
                                            .getFirstName()
                                    : "")
                            + " " + (chiTiet.getPhong().getHomestay().getNguoiDung()
                                    .getLastName() != null
                                            ? chiTiet.getPhong()
                                                    .getHomestay()
                                                    .getNguoiDung()
                                                    .getLastName()
                                            : "");
                    dto.setHostName(hostName.trim());
                }
            }
        }

        dto.setStatus(booking.getTrangThai());
        dto.setBookingDate(booking.getNgayLap().toLocalDate());

        dto.setTotalAmount(totalAmount.doubleValue());

        return dto;
    }

    public static BookingResponseDto toBookingResponseDto(PhieuDatPhong booking,
            BigDecimal tongTien, BigDecimal haveToPayPrice, boolean isCancelable, boolean isReviewable) {
        BookingResponseDto dto = new BookingResponseDto();
        HoaDon hoaDon = booking.getHoadon();
        if (hoaDon != null) {
            dto.setInvId(hoaDon.getMaHD());
            if (hoaDon.getKhuyenMai() != null) {
                dto.setPromotionId(hoaDon.getKhuyenMai().getMaKM());
            }
        }
        if (haveToPayPrice != null) {
            dto.setHaveToPayPrice(haveToPayPrice);
        }
        dto.setReviewable(isReviewable);
        dto.setCancelable(isCancelable);
        dto.setBookingId(booking.getMaPDPhong());
        dto.setHomestayName(booking.getChiTietDatPhongs().get(0).getPhong().getHomestay().getTenHomestay());
        dto.setHomestayId(booking.getChiTietDatPhongs().get(0).getPhong().getHomestay().getIdHomestay());
        dto.setTotalPrice(tongTien);
        dto.setStatus(booking.getTrangThai());
        dto.setRooms(new ArrayList<>());
        dto.setLocation(booking.getChiTietDatPhongs().get(0).getPhong().getHomestay().getDiaChi() + ", "
                + booking.getChiTietDatPhongs().get(0).getPhong().getHomestay().getKhuVuc().getTenKv());
        dto.setCheckIn(booking.getChiTietDatPhongs().get(0).getNgayDen().toLocalDate().toString());
        dto.setCheckOut(booking.getChiTietDatPhongs().get(0).getNgayDi().toLocalDate().toString());
        if (booking.getChiTietDatPhongs() != null && !booking.getChiTietDatPhongs().isEmpty()) {
            var chiTiet = booking.getChiTietDatPhongs();
            for (var item : chiTiet) {
                var room = new BookingResponseDto.Room();
                room.setPrice(item.getPhong().getDonGia());
                room.setImage(item.getPhong().getHinhAnhPhongs().stream()
                        .filter(h -> h.isLaAnhChinh())
                        .findFirst()
                        .map(h -> h.getUrlAnh())
                        .orElse(""));
                room.setRoomType(item.getPhong().getTenPhong() + " - " + item.getPhong().getLoaiPhong().getTenLoai());
                room.setServices(item.getChiTietDichVus().stream()
                        .map(dv -> {
                            var service = new BookingResponseDto.Room.Service();
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

    public static HostBookingDataResponseDto toHostBookingDataResponseDto(PhieuDatPhong booking,
            BigDecimal totalAmount, List<BookedRoom> bookedRooms, BigDecimal feeAmount) {
        HostBookingDataResponseDto dto = new HostBookingDataResponseDto();
        dto.setId(booking.getMaPDPhong());
        dto.setGuestId(booking.getNguoiDung().getUserId());
        dto.setGuestName(booking.getNguoiDung().getFirstName() + " " + booking.getNguoiDung().getLastName());
        dto.setGuestEmail(booking.getNguoiDung().getEmail());
        dto.setGuestPhone(booking.getNguoiDung().getPhoneNumber());
        dto.setGuestAvatar(booking.getNguoiDung().getPicture());

        if (booking.getChiTietDatPhongs() != null && !booking.getChiTietDatPhongs().isEmpty()) {
            dto.setHomestayId(booking.getChiTietDatPhongs().get(0).getPhong().getHomestay().getIdHomestay());
            dto.setHomestayName(booking.getChiTietDatPhongs().get(0).getPhong().getHomestay().getTenHomestay());
            dto.setCheckIn(booking.getChiTietDatPhongs().get(0).getNgayDen().toLocalDate());
            dto.setCheckOut(booking.getChiTietDatPhongs().get(0).getNgayDi().toLocalDate());
        }
        dto.setFeeAmount(feeAmount.doubleValue());
        dto.setBookingDate(booking.getNgayLap().toLocalDate());
        dto.setStatus(booking.getTrangThai());
        dto.setPaymentStatus(
                booking.getHoadon() != null && booking.getHoadon().getThanhToans() != null
                        && !booking.getHoadon().getThanhToans().isEmpty()
                                ? booking.getHoadon().getThanhToans().get(0).getTrangThai()
                                : null);
        dto.setTotalAmount(totalAmount.doubleValue());
        dto.setCancellationReason(
                booking.getPhieuHuyPhongs() != null && !booking.getPhieuHuyPhongs().isEmpty()
                        ? booking.getPhieuHuyPhongs().get(0).getLyDo()
                        : null);
        dto.setBookedRooms(bookedRooms);
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

    // public static BookingResponseDto toBookingPaymentResponseDto(PhieuDatPhong
    // booking) {
    // if (booking == null || booking.getHoadon() == null) {
    // return null;
    // }

    // HoaDon hoaDon = booking.getHoadon();

    // return null;
    // }
}
