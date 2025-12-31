package com.bookinghomestay.app.application.admin.service.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HostServiceData {
    private String id;
    private String homestayId;
    private String homestayName;
    private String serviceName;
    private String description;
    private String image;
    private double price;
    private String status;
    private LocalDateTime requestDate;
    private LocalDateTime approveDate;
    private String hostName;
    private String hostPhone;
}
