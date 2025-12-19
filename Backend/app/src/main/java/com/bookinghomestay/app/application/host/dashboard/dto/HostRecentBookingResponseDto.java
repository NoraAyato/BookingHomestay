package com.bookinghomestay.app.application.host.dashboard.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HostRecentBookingResponseDto {
    private String id;
    private String guestName;
    private String guestAvatar;
    private String homestay;
    private String homestayId;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private int totalAmount;
    private String status;
    private String createdAt;
}
