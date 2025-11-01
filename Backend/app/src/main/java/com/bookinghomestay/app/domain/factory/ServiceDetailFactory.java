package com.bookinghomestay.app.domain.factory;

import com.bookinghomestay.app.domain.model.ChiTietDichVu;
import com.bookinghomestay.app.domain.model.DichVu;

import java.time.LocalDate;

public interface ServiceDetailFactory {
    ChiTietDichVu createServiceDetail(String bookingId, String roomId, DichVu service);
}
