package com.bookinghomestay.app.application.booking.factory;

import com.bookinghomestay.app.domain.factory.ServiceDetailFactory;
import com.bookinghomestay.app.domain.model.ChiTietDichVu;
import com.bookinghomestay.app.domain.model.DichVu;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class ServiceDetailFactoryImpl implements ServiceDetailFactory {

    @Override
    public ChiTietDichVu createServiceDetail(String bookingId, String roomId, DichVu service) {
        ChiTietDichVu chiTietDichVu = new ChiTietDichVu();
        chiTietDichVu.setMaPDPhong(bookingId);
        chiTietDichVu.setMaPhong(roomId);
        chiTietDichVu.setMaDV(service.getMaDV());
        chiTietDichVu.setSoLuong(BigDecimal.ONE);
        chiTietDichVu.setNgaySuDung(LocalDateTime.now().toLocalDate());
        chiTietDichVu.setDichVu(service);
        return chiTietDichVu;
    }
}
