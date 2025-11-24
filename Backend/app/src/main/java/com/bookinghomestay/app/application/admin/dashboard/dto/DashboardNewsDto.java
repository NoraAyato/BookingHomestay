package com.bookinghomestay.app.application.admin.dashboard.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class DashboardNewsDto {
    private String id;
    private String title;
    private String status;
    private String views;
    private String date;
}
