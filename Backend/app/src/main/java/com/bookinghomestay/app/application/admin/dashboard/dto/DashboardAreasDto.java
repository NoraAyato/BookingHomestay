package com.bookinghomestay.app.application.admin.dashboard.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class DashboardAreasDto {
    private String location;
    private String homestayCount;
}
