package com.bookinghomestay.app.application.admin.location.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class LocationInfoResponseDto {
    private String id;
    private String name;
    private String description;
    private int homestaysCount;
    private int bookingsCount;
    private String status;
    private String image;
}
