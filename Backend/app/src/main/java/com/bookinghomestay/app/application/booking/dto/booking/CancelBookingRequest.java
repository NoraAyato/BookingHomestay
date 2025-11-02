package com.bookinghomestay.app.application.booking.dto.booking;

import lombok.Data;

@Data
public class CancelBookingRequest {
    private String maPDPhong;
    private String lyDoHuy;
    private String tenNganHang;
    private String soTaiKhoan;
}
