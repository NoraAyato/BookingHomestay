package com.bookinghomestay.app.application.homestay.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomAvailabilityDto {
    private String id;
    private String description;
    private String name;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private String roomType;
    private int maxOccupancy;
    private List<String> images;
    private List<String> amenities;
    private boolean available;
}
