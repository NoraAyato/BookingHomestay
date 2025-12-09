package com.bookinghomestay.app.application.admin.reviews.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.DanhGia;
import com.bookinghomestay.app.domain.repository.IReviewRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeleteReviewCommandHandler {
    private final IReviewRepository reviewRepository;

    public void handle(String reviewId) {
        try {
            DanhGia existingReview = reviewRepository.findById(reviewId)
                    .orElseThrow(() -> new RuntimeException("Đánh giá với ID " + reviewId + " không tồn tại."));
            reviewRepository.deleteById(existingReview.getIdDG());
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi xóa đánh giá" + e.toString(), e);
        }
    }
}
