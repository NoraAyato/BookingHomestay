package com.bookinghomestay.app.application.booking.command;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CancelBookingCommand {
    private String maPDPhong;
    private String userId;
    private String lyDoHuy;
    private String tenNganHang;
    private String soTaiKhoan;
}
