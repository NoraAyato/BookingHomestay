package com.bookinghomestay.app.api.dto.homestay;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HomestayTop5ResponeDto {
    private String id;
    private String title;
    private String location;
    private Double price;
    private String image;
    private Double rating;
    private Integer reviews;
}
