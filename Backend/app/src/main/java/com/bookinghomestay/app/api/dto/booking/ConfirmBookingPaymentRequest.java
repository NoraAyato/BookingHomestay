package com.bookinghomestay.app.api.dto.booking;

import java.util.List;

import lombok.Data;

@Data
public class ConfirmBookingPaymentRequest {
    private String maPDPhong;
    private List<String> serviceIds;
    private String promotionId;
}
