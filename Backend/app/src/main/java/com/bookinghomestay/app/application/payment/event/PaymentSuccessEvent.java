package com.bookinghomestay.app.application.payment.event;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Event được publish khi payment thành công
 */
@Data
@AllArgsConstructor
public class PaymentSuccessEvent {
    private Long bookingId;
    private String userId;
    private String homestayName;
    private Double amount;
    private String paymentMethod; // "momo", "vnpay", etc.
}
