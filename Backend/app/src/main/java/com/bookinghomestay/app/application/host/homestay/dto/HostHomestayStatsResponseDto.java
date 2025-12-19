package com.bookinghomestay.app.application.host.homestay.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HostHomestayStatsResponseDto {
    private int total;
    private int active;
    private int inactive;
    private int totalRevenue;
}
