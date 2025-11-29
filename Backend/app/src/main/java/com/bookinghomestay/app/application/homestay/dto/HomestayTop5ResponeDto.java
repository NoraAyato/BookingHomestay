package com.bookinghomestay.app.application.homestay.dto;

import java.math.BigDecimal;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HomestayTop5ResponeDto {
    private String id;
    private String title;
    private String location;
    private BigDecimal price;
    private String image;
    private Double rating;
    private Integer reviews;
}
