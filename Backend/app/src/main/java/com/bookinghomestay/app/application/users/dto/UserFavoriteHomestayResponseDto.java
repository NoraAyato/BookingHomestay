package com.bookinghomestay.app.application.users.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class UserFavoriteHomestayResponseDto {
    private String idHomestay;
    private String name;
    private String location;
    private BigDecimal price;
    private Double rating;
    private String image;
}
