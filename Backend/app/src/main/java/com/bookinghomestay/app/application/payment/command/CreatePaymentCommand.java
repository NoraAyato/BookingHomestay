package com.bookinghomestay.app.application.payment.command;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class CreatePaymentCommand {
    private String bookingId;
    private BigDecimal soTien;
    private String phuongThuc; // "MOMO", "VNPAY", etc.
    private String noiDung;
    private String returnUrl;
    private String notifyUrl;
    private String userId;
}
