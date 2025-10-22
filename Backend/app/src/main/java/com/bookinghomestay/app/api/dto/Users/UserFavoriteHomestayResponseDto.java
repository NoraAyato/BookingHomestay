package com.bookinghomestay.app.api.dto.users;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class UserFavoriteHomestayResponseDto {
    private String id;
    private String name;
    private String location;
    private BigDecimal price;
    private Double rating;
    private String image;
}
