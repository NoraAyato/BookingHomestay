// file: GetHomestayDetailQueryHandler.java
package com.bookinghomestay.app.application.homestay.query;

import com.bookinghomestay.app.application.homestay.dto.HomestayDetailResponseDto;
import com.bookinghomestay.app.application.users.dto.HostDetailResponseDto;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.repository.IDanhGiaRepository;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;
import com.bookinghomestay.app.domain.service.HomestayService;
import com.bookinghomestay.app.domain.service.PromotionService;
import com.bookinghomestay.app.domain.service.UserService;
import com.bookinghomestay.app.infrastructure.mapper.HomestayMapper;
import com.bookinghomestay.app.infrastructure.mapper.UserMapper;
import com.bookinghomestay.app.domain.exception.ResourceNotFoundException;
import com.bookinghomestay.app.domain.exception.BusinessException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetHomestayDetailQueryHandler {

        private final IHomestayRepository homestayRepository;
        private final IDanhGiaRepository danhGiaRepository;
        private final HomestayService homestayService;
        private final PromotionService promotionService;
        private final IKhuyenMaiRepository khuyenMaiRepository;
        private final UserService userService;

        @Transactional
        public HomestayDetailResponseDto handle(GetHomestayDetailQuery query) {
                // Lấy thông tin homestay
                Homestay homestay = homestayRepository.findById(query.getHomestayId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Không tìm thấy homestay "));

                // Kiểm tra tính hợp lệ của homestay
                if (!homestayService.validateHomestay(homestay)) {
                        throw new BusinessException("Homestay không hợp lệ hoặc thiếu thông tin bắt buộc");
                }
                List<KhuyenMai> allAvailableKhuyenMai = khuyenMaiRepository.getAllAvailableKhuyenMai();
                BigDecimal percentDiscount = BigDecimal.ZERO;
                BigDecimal minPrice = homestayService.caculateMinRoomPriceByHomestay(homestay);

                BigDecimal discountPrice = homestayService.getHomestayDiscountPrice(homestay);
                BigDecimal discountPriceByAdmin = promotionService.getBestDiscountedPrice(
                                minPrice,
                                allAvailableKhuyenMai);
                BigDecimal bestDiscountPrice = discountPrice.compareTo(discountPriceByAdmin) < 0
                                ? discountPrice
                                : discountPriceByAdmin;
                percentDiscount = promotionService.calculatePercentDiscount(minPrice,
                                bestDiscountPrice);
                boolean isNews = false;
                boolean isFeatured = false;
                List<String> images = homestayService.getHomestayImages(homestay);
                List<String> amenitiesList = homestayService.getHomestayAmenities(homestay);
                // Lấy thông tin đánh giá
                int totalReviews = danhGiaRepository.countByHomestayId(query.getHomestayId());
                Double ratingPoint = danhGiaRepository.averageHaiLongByHomestayId(query.getHomestayId());
                double rating = ratingPoint != null ? ratingPoint : 0.0;
                HostDetailResponseDto host = UserMapper.toHostDetailDto(homestay.getNguoiDung(),
                                userService.getJoinedTime(homestay.getNguoiDung().getCreatedAt()));
                // Chuyển đổi sang DTO
                return HomestayMapper.toHomestayDetailResponseDto(homestay, totalReviews, rating, minPrice,
                                percentDiscount, amenitiesList, images, isNews, isFeatured, host);
        }
}
