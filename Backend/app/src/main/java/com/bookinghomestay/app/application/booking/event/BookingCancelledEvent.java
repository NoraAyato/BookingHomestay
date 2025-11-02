package com.bookinghomestay.app.application.booking.event;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Event được publish khi booking bị cancel
 */
@Data
@AllArgsConstructor
public class BookingCancelledEvent {
    private Long bookingId;
    private String hostUserId;
    private String guestUserId;
    private String homestayName;
    private String cancelledBy;     // "guest" hoặc "host"
    private String cancelReason;    // Lý do hủy
}
