package com.bookinghomestay.app.application.host.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ServiceDataDto {
    private String id;
    private String homestayId;
    private String homestayName;
    private String name;
    private double price;
    private String description;
    private String image;
}
