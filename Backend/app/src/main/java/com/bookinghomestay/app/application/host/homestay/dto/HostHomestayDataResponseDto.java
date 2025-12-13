package com.bookinghomestay.app.application.host.homestay.dto;

import java.time.LocalDate;
import java.util.List;

import com.bookinghomestay.app.application.host.service.dto.ServiceDataDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HostHomestayDataResponseDto {
    private String id;
    private String name;
    private String locationId;
    private String location;
    private String address;
    private String description;
    private String status;
    private int totalRooms;
    private double rating;
    private int reviews;
    private int totalBookings;
    private int revenue;
    private String image;
    private List<String> amenities;
    private LocalDate createdAt;
    private int availableRooms;
    private List<ServiceDataDto> services;
}
