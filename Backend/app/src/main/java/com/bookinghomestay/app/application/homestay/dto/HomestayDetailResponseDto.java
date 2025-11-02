package com.bookinghomestay.app.application.homestay.dto;

import java.math.BigDecimal;
import java.util.List;

import com.bookinghomestay.app.application.policies.dto.PoliciesResponseDto;
import com.bookinghomestay.app.application.users.dto.HostDetailResponseDto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HomestayDetailResponseDto {
    private String id;
    private String title;
    private String description;
    private String location;
    private String address;
    private String price;
    private String discountPrice;
    private double rating;
    private int reviews;
    private List<String> images;
    private List<String> amenities;
    private PoliciesResponseDto policies;
    private HostDetailResponseDto host;
    private boolean isNew;
    private boolean isFeatured;

}
