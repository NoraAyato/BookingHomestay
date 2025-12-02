package com.bookinghomestay.app.application.admin.usermanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserStatsDto {
    private String total;
    private String active;
    private String inactive;
}
