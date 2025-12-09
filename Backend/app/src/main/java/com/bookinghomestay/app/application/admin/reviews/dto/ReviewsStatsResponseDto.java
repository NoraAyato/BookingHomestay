package com.bookinghomestay.app.application.admin.reviews.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewsStatsResponseDto {
    private int totalReviews;
    private int negativeRate;
    private int positiveRate;
    private int recentReviews;
}
