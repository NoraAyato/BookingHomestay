package com.bookinghomestay.app.application.booking.event;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Event được publish khi có booking mới được tạo
 * Event này sẽ trigger việc gửi thông báo cho Host
 */
@Data
@AllArgsConstructor
public class BookingCreatedEvent {
    private Long bookingId;
    private String hostUserId; // User ID của chủ nhà
    private String guestUserId; // User ID của người đặt
    private String guestName; // Tên người đặt
    private String homestayName; // Tên homestay
    private String checkInDate; // Ngày check-in
    private String checkOutDate; // Ngày check-out
}
