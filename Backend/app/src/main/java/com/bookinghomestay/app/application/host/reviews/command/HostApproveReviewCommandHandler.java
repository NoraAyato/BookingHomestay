package com.bookinghomestay.app.application.host.reviews.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.DanhGia;
import com.bookinghomestay.app.domain.repository.IReviewRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HostApproveReviewCommandHandler {
    private final IReviewRepository reviewRepository;

    public void handle(String reviewId, String hostId) {
        try {
            DanhGia existingReview = reviewRepository.findById(reviewId)
                    .orElseThrow(() -> new RuntimeException("Đánh giá với ID " + reviewId + " không tồn tại."));
            boolean isHostValid = existingReview.getHomestay().getNguoiDung().getUserId()
                    .equalsIgnoreCase(hostId);
            if (!isHostValid) {
                throw new IllegalArgumentException("Bạn không có quyền duyệt đánh giá này");
            }
            existingReview.setTrangThai(true);
            reviewRepository.save(existingReview);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi duyệt đánh giá !");
        }
    }
}
