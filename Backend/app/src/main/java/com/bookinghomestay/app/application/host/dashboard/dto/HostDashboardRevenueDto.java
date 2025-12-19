package com.bookinghomestay.app.application.host.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HostDashboardRevenueDto {
    private String month;
    private String revenue;
    private String bookings;
}
