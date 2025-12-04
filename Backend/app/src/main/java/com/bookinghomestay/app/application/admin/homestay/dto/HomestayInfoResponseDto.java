package com.bookinghomestay.app.application.admin.homestay.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HomestayInfoResponseDto {
    private String id;
    private String name;
    private String location;
    private String host;
    private String description;
    private String status;
    private double rating;
    private int reviews;
    private int rooms;
    private String hostEmail;
    private double pricePerNight;
    private int totalBookings;
    private double revenue;
    private String image;
}
