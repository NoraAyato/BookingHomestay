package com.bookinghomestay.app.application.admin.dashboard.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class DashboardPromotionDto {
    private String id;
    private String name;
    private String status;
    private String used;
    private String total;
}
