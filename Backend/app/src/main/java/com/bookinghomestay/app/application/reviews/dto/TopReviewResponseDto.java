package com.bookinghomestay.app.application.reviews.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopReviewResponseDto {
    private String id;
    private String name;
    private String avatar;
    private String location;
    private String content;
    private double rating;
    private String homestay;
    private LocalDate date;
    private String image;
}
