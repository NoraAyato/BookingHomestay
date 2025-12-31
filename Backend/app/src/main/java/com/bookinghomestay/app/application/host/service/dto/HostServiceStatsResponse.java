package com.bookinghomestay.app.application.host.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HostServiceStatsResponse {
    private int totalServices;
    private int approvedServices;
    private int pendingServices;
    private int rejectedServices;
}
