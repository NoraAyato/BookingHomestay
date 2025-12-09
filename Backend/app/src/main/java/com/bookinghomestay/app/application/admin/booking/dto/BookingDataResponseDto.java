package com.bookinghomestay.app.application.admin.booking.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingDataResponseDto {
    private String id;
    private String guestName;
    private String guestEmail;
    private String guestPhone;
    private String homestay;
    private String hostName;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private String status;
    private Double totalAmount;
    private Double paidAmount;
    private LocalDate bookingDate;
    private String paymentMethod;
    private String paymentStatus;
}
