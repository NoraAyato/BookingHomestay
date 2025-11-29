package com.bookinghomestay.app.application.homestay.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HomestaySearchResponse {
    private String id;
    private String title;
    private String description;
    private String location;
    private String address;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private double rating;
    private String image;
    private List<String> amenities;
    private boolean isNew;
    private boolean isPopular;
    private int reviews;
}
