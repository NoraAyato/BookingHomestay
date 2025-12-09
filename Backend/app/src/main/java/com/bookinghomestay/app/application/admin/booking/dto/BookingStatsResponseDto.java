package com.bookinghomestay.app.application.admin.booking.dto;

import com.google.auto.value.AutoValue.Builder;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookingStatsResponseDto {
    private int total;
    private int pending;
    private int booked;
    private int cancelled;
    private int completed;
}
