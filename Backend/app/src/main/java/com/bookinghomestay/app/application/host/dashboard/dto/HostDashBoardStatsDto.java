package com.bookinghomestay.app.application.host.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HostDashBoardStatsDto {
    private int totalRevenue;
    private int monthlyRevenue;
    private int totalBookings;
    private int totalHomestays;
    private int activeHomestays;
    private double averageRating;
    private int totalReviews;
    private ChangePercentages changePercentages;
}
