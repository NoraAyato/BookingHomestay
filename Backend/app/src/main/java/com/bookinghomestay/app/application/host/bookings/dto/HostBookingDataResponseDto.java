package com.bookinghomestay.app.application.host.bookings.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class HostBookingDataResponseDto {
    private String id;
    private String guestId;
    private String guestName;
    private String guestEmail;
    private String guestPhone;
    private String guestAvatar;
    private String homestayId;
    private String homestayName;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private LocalDate bookingDate;
    private String status;
    private String paymentStatus;
    private Double totalAmount;
    private Double feeAmount;
    private String cancellationReason;
    private List<BookedRoom> bookedRooms;
}
