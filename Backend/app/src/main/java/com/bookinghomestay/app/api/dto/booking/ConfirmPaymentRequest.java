package com.bookinghomestay.app.api.dto.booking;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ConfirmPaymentRequest {
    private String maPDPhong;
    private BigDecimal soTien;
    private String phuongThuc;
}
