package com.bookinghomestay.app.domain.factory;

import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.model.Phong;
import com.bookinghomestay.app.domain.model.User;

import java.time.LocalDate;
import java.util.List;

public interface BookingFactory {
    PhieuDatPhong createBooking(User user, Phong phong, LocalDate ngayDen, LocalDate ngayDi, String status);

    PhieuDatPhong addRoom(PhieuDatPhong booking, List<String> roomIds);

    PhieuDatPhong addService(PhieuDatPhong booking, List<String> serviceIds);
}
