package com.bookinghomestay.app.application.location.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LocationTop5ResponeDto {
    private String id;
    private String name;
    private String description;
    private String image;
    private int count;
}
