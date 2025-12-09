package com.bookinghomestay.app.application.admin.reviews.query;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.reviews.dto.ReviewsStatsResponseDto;
import com.bookinghomestay.app.domain.model.DanhGia;
import com.bookinghomestay.app.domain.repository.IReviewRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetReviewsStatsQueryHandler {
    private final IReviewRepository reviewRepository;

    public ReviewsStatsResponseDto handle() {
        List<DanhGia> reviews = reviewRepository.getAll();
        int totalReviews = reviews.size();
        int positiveReviewsCount = (int) reviews.stream()
                .filter(review -> (review.getDichVu() + review.getSachSe() + review.getTienIch()) / 3.0 >= 4)
                .count();
        int negativeReviewsCount = (int) reviews.stream()
                .filter(review -> (review.getDichVu() + review.getSachSe() + review.getTienIch()) / 3.0 < 3)
                .count();
        LocalDateTime currentEnd = LocalDateTime.now();
        LocalDateTime currentStart = currentEnd.minusDays(30);
        int newReviewsCount = (int) reviews.stream()
                .filter(review -> review.getNgayDanhGia().isAfter(currentStart)
                        && review.getNgayDanhGia().isBefore(currentEnd))
                .count();
        return new ReviewsStatsResponseDto(totalReviews, positiveReviewsCount, negativeReviewsCount, newReviewsCount);
    }
}