package com.bookinghomestay.app.application.booking.factory;

import org.springframework.stereotype.Component;
import com.bookinghomestay.app.domain.model.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

@Component
public class BookingFactory {

    public static PhieuDatPhong createBooking(User user, Phong phong,
            LocalDate ngayDen, LocalDate ngayDi) {
        PhieuDatPhong booking = new PhieuDatPhong();
        String uuid = UUID.randomUUID().toString().replace("-", "");
        booking.setMaPDPhong("BK-" + uuid.substring(0, 20));
        booking.setNgayLap(LocalDateTime.now());
        booking.setTrangThai("Pending");
        booking.setNguoiDung(user);
        booking.setChiTietDatPhongs(new ArrayList<>());

        ChiTietDatPhong chiTiet = new ChiTietDatPhong();
        chiTiet.setMaPDPhong(booking.getMaPDPhong());
        chiTiet.setMaPhong(phong.getMaPhong());
        chiTiet.setNgayDen(ngayDen.atStartOfDay());
        chiTiet.setNgayDi(ngayDi.atStartOfDay());

        booking.getChiTietDatPhongs().add(chiTiet);
        return booking;
    }
}