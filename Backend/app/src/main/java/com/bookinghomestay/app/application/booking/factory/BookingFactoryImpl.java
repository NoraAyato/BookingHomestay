package com.bookinghomestay.app.application.booking.factory;

import com.bookinghomestay.app.domain.factory.BookingFactory;
import com.bookinghomestay.app.domain.model.ChiTietDatPhong;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.model.Phong;
import com.bookinghomestay.app.domain.model.User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class BookingFactoryImpl implements BookingFactory {

    @Override
    public PhieuDatPhong createBooking(User user, Phong phong, LocalDate ngayDen, LocalDate ngayDi, String status) {
        PhieuDatPhong booking = new PhieuDatPhong();
        String uuid = UUID.randomUUID().toString().replace("-", "");
        booking.setMaPDPhong("BK-" + uuid.substring(0, 20));
        booking.setNgayLap(LocalDateTime.now());
        booking.setTrangThai(status == null ? "Pending" : status);
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

    @Override
    public PhieuDatPhong addRoom(PhieuDatPhong booking, List<String> roomIds) {
        for (String roomId : roomIds) {
            ChiTietDatPhong chiTiet = new ChiTietDatPhong();
            chiTiet.setMaPDPhong(booking.getMaPDPhong());
            chiTiet.setMaPhong(roomId);
            ChiTietDatPhong firstRoom = booking.getChiTietDatPhongs().get(0);
            chiTiet.setNgayDen(firstRoom.getNgayDen());
            chiTiet.setNgayDi(firstRoom.getNgayDi());
            booking.getChiTietDatPhongs().add(chiTiet);
        }
        return booking;
    }

    @Override
    public PhieuDatPhong addService(PhieuDatPhong booking, List<String> serviceIds) {
        for (String serviceId : serviceIds) {
            
        }
        return booking;
    }
}
