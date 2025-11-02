package com.bookinghomestay.app.application.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateMoMoPaymentRequest {

    @NotBlank(message = "Mã đơn đặt phòng không được để trống")
    private String bookingId;

    @NotNull(message = "Số tiền không được để trống")
    private BigDecimal soTien;

    @NotBlank(message = "Nội dung thanh toán không được để trống")
    private String noiDung;

    private String returnUrl; // Optional - will use default from config if not provided
    private String notifyUrl; // Optional - will use default from config if not provided
}
