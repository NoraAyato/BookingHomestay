package com.bookinghomestay.app.application.booking.query;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GetBookingDetailQuery {
    private String bookingId;
}