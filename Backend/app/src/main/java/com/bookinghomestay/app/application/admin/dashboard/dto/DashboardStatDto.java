package com.bookinghomestay.app.application.admin.dashboard.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class DashboardStatDto {
    private String title;
    private String value;
    private String change;
    private String trend;
}
