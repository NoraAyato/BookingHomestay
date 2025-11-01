package com.bookinghomestay.app.application.booking.event;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Event được publish khi booking được confirm
 */
@Data
@AllArgsConstructor
public class BookingConfirmedEvent {
    private Long bookingId;
    private String hostUserId;
    private String guestUserId;
    private String homestayName;
}
