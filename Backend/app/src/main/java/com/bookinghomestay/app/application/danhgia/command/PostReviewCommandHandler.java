package com.bookinghomestay.app.application.danhgia.command;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.bookinghomestay.app.application.danhgia.dto.ReviewAddCommandDto;
import com.bookinghomestay.app.domain.factory.ReviewFactory;
import com.bookinghomestay.app.domain.model.DanhGia;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.repository.IReviewRepository;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.ReviewService;
import com.bookinghomestay.app.infrastructure.file.FileStorageService;
import com.bookinghomestay.app.infrastructure.service.ActivityLogHelper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostReviewCommandHandler {
    private final IReviewRepository reviewRepository;
    private final ReviewFactory reviewFactory;
    private final FileStorageService fileStorageService;
    private final IUserRepository userRepository;
    private final IHomestayRepository homestayRepository;
    private final IBookingRepository bookingRepository;
    private final ActivityLogHelper activityLogHelper;
    private final ReviewService reviewService;

    public void handle(ReviewAddCommandDto commandDto) {
        try {
            Optional<DanhGia> reviewOpt = reviewRepository.findByIdHomestayAndBookingId(commandDto.getHomestayId(),
                    commandDto.getBookingId());
            if (reviewOpt.isPresent()) {
                throw new IllegalArgumentException("Đã có đánh giá cho đặt phòng này");
            }
            Optional<User> userOpt = userRepository.findById(commandDto.getUserId());
            if (userOpt.isEmpty()) {
                throw new IllegalArgumentException("Người dùng không tồn tại");
            }
            Optional<Homestay> homestayOpt = homestayRepository.findById(commandDto.getHomestayId());
            if (homestayOpt.isEmpty()) {
                throw new IllegalArgumentException("Người dùng không tồn tại");
            }
            Optional<PhieuDatPhong> bookingOpt = bookingRepository.findById(commandDto.getBookingId());
            if (bookingOpt.isEmpty()) {
                throw new IllegalArgumentException("Đặt phòng không tồn tại");
            }
            String relativePath = null;
            MultipartFile file = commandDto.getImage();
            if (file != null && !file.isEmpty()) {
                relativePath = fileStorageService.storeReview(file, "RV_");
            }
            DanhGia review = reviewFactory.createReview(homestayOpt.get(), bookingOpt.get(), userOpt.get(),
                    commandDto.getCleanlinessRating(), commandDto.getUtilitiesRating(), commandDto.getServiceRating(),
                    commandDto.getComment(), relativePath);
            reviewRepository.save(review);
            activityLogHelper.logReviewCreated(review.getIdDG(), review.getHomestay().getTenHomestay(),
                    reviewService.calculateAverageRating(review));
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi thêm đánh giá: " + commandDto.toString(), e);
        }

    }
}
