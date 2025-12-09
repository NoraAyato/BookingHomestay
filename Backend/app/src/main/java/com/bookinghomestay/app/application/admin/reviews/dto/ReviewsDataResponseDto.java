package com.bookinghomestay.app.application.admin.reviews.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewsDataResponseDto {
    private String id;
    private String guestName;
    private String guestAvatar;
    private String homestayName;
    private String homestayId;
    private int rating;
    private String content;
    private LocalDate date;
    private String bookingId;
    private String image;
}
