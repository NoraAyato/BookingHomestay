package com.bookinghomestay.app.application.booking.command;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BookingPaymentCommand {
    private String maPDPhong;
    private BigDecimal soTien;
    private String phuongThuc;
    private String userId;
}
