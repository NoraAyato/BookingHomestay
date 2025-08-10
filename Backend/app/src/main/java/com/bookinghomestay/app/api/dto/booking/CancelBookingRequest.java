package com.bookinghomestay.app.api.dto.booking;

import lombok.Data;

@Data
public class CancelBookingRequest {
    private String maPDPhong;
    private String lyDoHuy;
    private String tenNganHang;
    private String soTaiKhoan;
}
