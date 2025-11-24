package com.bookinghomestay.app.application.admin.dashboard.dto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class DashboardBookingStatusDto {
    private String name;
    private String value;
}