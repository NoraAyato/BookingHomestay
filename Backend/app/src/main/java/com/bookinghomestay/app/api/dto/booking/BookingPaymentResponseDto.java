package com.bookinghomestay.app.api.dto.booking;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingPaymentResponseDto {
    private String maPDPhong;
    private String maHD;
    private BigDecimal totalAmount;
    private String status;
}
