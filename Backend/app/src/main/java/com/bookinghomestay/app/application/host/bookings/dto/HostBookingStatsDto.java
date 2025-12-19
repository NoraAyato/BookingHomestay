package com.bookinghomestay.app.application.host.bookings.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class HostBookingStatsDto {
    private int total;
    private int pending;
    private int booked;
    private int cancelled;
    private int completed;
    private int revenue;
}
