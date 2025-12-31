package com.bookinghomestay.app.application.homestay.query;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.homestay.dto.HomestaySearchResponse;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;
import com.bookinghomestay.app.domain.repository.IReviewRepository;
import com.bookinghomestay.app.domain.service.HomestayService;
import com.bookinghomestay.app.domain.service.PromotionService;
import com.bookinghomestay.app.infrastructure.mapper.HomestayMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetSearchHomestayQueryHandler {
        private final IHomestayRepository homestayRepository;
        private final IReviewRepository reviewRepository;
        private final HomestayService homestayService;
        private final PromotionService promotionService;
        private final IKhuyenMaiRepository khuyenMaiRepository;

        public PageResponse<HomestaySearchResponse> handle(GetSearchHomestayQuery query) {
                // 1. Push filter xuống DB nếu có thể (ideal)
                List<Homestay> homestays = homestayRepository.getAllActiveHomestay();

                // 2. Filter trước pagination (giữ nguyên logic hiện tại)
                List<Homestay> filteredHomestays = homestays.stream()
                                .filter(homestay -> {
                                        if (query.getLocationId() != null && !query.getLocationId().isEmpty()) {
                                                return homestayService.isInLocationId(homestay, query.getLocationId());
                                        }
                                        return true;
                                })
                                .filter(homestay -> homestayService.isAvailableHomestay(homestay,
                                                query.getCheckIn(), query.getCheckOut()))
                                .filter(homestay -> homestayService.isInPriceRange(
                                                homestay, query.getMinPrice(), query.getMaxPrice()))
                                .filter(homestay -> query.getAmenitiesId() == null ||
                                                query.getAmenitiesId().isEmpty() ||
                                                homestayService.hasAllAmenities(homestay, query.getAmenitiesId()))
                                .collect(Collectors.toList());

                int total = filteredHomestays.size();
                int page = query.getPage();
                int limit = query.getLimit();

                // 3. PAGINATION TRƯỚC - CHỈ lấy homestays cần hiển thị
                List<Homestay> paginatedHomestays = filteredHomestays.stream()
                                .skip((long) (page - 1) * limit)
                                .limit(limit)
                                .collect(Collectors.toList());

                // 4. DI CHUYỂN getAllAvailableKhuyenMai VÀO ĐÂY (sau pagination)
                List<KhuyenMai> allAvailableKhuyenMai = khuyenMaiRepository.getAllAvailableKhuyenMai().stream()
                                .filter(km -> km.getTrangThai().equalsIgnoreCase("ACTIVE"))
                                .filter(km -> !LocalDateTime.now().isBefore(km.getNgayKetThuc())
                                                && !LocalDateTime.now().isAfter(km.getNgayBatDau()))
                                .collect(Collectors.toList());

                // 5. BATCH LOAD ratings cho các homestays cần hiển thị
                List<String> homestayIds = paginatedHomestays.stream()
                                .map(Homestay::getIdHomestay)
                                .collect(Collectors.toList());
                Map<String, Double> ratingsMap = reviewRepository
                                .averageHaiLongByHomestayIds(homestayIds);

                // 6. Map DTO CHỈ cho homestays đã paginate
                List<HomestaySearchResponse> homestayDtos = paginatedHomestays.stream()
                                .map(homestay -> {
                                        BigDecimal minPrice = homestayService.caculateMinRoomPriceByHomestay(homestay);
                                        List<String> amenities = homestayService.getHomestayAmenities(homestay);
                                        BigDecimal discountPrice = homestayService.getHomestayDiscountPrice(homestay);
                                        BigDecimal discountPriceByAdmin = promotionService.getBestDiscountedPrice(
                                                        minPrice, allAvailableKhuyenMai);

                                        BigDecimal bestDiscountPrice = discountPrice.compareTo(discountPriceByAdmin) < 0
                                                        ? discountPrice
                                                        : discountPriceByAdmin;

                                        // SỬ DỤNG batch loaded ratings
                                        Double ratingPoint = ratingsMap.getOrDefault(homestay.getIdHomestay(), 0.0);
                                        double rating = ratingPoint != null ? Math.floor(ratingPoint * 10) / 10.0 : 0.0;

                                        boolean isNew = false;
                                        boolean isPopular = false;

                                        return HomestayMapper.toHomestaySearchResponse(
                                                        homestay, amenities, minPrice, bestDiscountPrice,
                                                        rating, isNew, isPopular);
                                })
                                .collect(Collectors.toList());

                PageResponse<HomestaySearchResponse> response = new PageResponse<>();
                response.setPage(page);
                response.setLimit(limit);
                response.setTotal(total);
                response.setItems(homestayDtos);
                return response;
        }
}
