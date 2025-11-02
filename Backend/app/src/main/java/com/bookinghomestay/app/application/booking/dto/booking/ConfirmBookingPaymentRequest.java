package com.bookinghomestay.app.application.booking.dto.booking;

import java.util.List;

import lombok.Data;

@Data
public class ConfirmBookingPaymentRequest {
    private String bookingId;
    private List<String> serviceIds;
    private List<String> roomIds;
}
