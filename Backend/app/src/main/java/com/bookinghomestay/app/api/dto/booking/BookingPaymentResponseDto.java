package com.bookinghomestay.app.api.dto.booking;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingPaymentResponseDto {
    private String bookingId;
    private String invId;
    private String homestayName;
    private String checkInDate;
    private String checkOutDate;
    private BigDecimal totalAmount;
    private String status;
}
