package com.bookinghomestay.app.application.homestay.query;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.homestay.dto.HomestaySearchResponse;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;
import com.bookinghomestay.app.domain.service.HomestayService;
import com.bookinghomestay.app.domain.service.PromotionService;
import com.bookinghomestay.app.infrastructure.mapper.HomestayMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetSearchHomestayQueryHandler {
        private final IHomestayRepository homestayRepository;

        private final HomestayService homestayService;
        private final PromotionService promotionService;
        private final IKhuyenMaiRepository khuyenMaiRepository;

        public PageResponse<HomestaySearchResponse> handle(GetSearchHomestayQuery query) {
                List<Homestay> homestays = homestayRepository.getAllActiveHomestay();

                // filter homestay
                List<Homestay> filteredHomestays = homestays.stream()
                                .filter(homestay -> {
                                        if (query.getLocationId() != null && !query.getLocationId().isEmpty()) {
                                                return homestayService.isInLocationId(homestay, query.getLocationId());
                                        }
                                        return true;
                                })
                                .filter(homestay -> homestayService.isAvailableHomestay(homestay, query.getCheckIn(),
                                                query.getCheckOut()))
                                .filter(homestay -> homestayService.isInPriceRange(
                                                homestay, query.getMinPrice(), query.getMaxPrice()))
                                .filter(homestay -> homestayService.hasAllAmenities(homestay, query.getAmenitiesId()))
                                .collect(Collectors.toList());

                int total = filteredHomestays.size();
                int page = query.getPage();
                int limit = query.getLimit();
                List<KhuyenMai> allAvailableKhuyenMai = khuyenMaiRepository.getAllAvailableKhuyenMai();

                List<HomestaySearchResponse> homestayDtos = filteredHomestays.stream()
                                .skip((long) (page - 1) * limit)
                                .limit(limit)
                                .map(homestay -> {
                                        BigDecimal percentDiscount = BigDecimal.ZERO;
                                        BigDecimal minPrice = homestayService.caculateMinRoomPriceByHomestay(homestay);
                                        List<String> amenities = homestayService.getHomestayAmenities(homestay);
                                        BigDecimal discountPrice = homestayService.getHomestayDiscountPrice(homestay);
                                        BigDecimal discountPriceByAdmin = promotionService.getBestDiscountedPrice(
                                                        minPrice,
                                                        allAvailableKhuyenMai);
                                        BigDecimal bestDiscountPrice = discountPrice.compareTo(discountPriceByAdmin) < 0
                                                        ? discountPrice
                                                        : discountPriceByAdmin;
                                        percentDiscount = promotionService.calculatePercentDiscount(minPrice,
                                                        bestDiscountPrice);
                                        double rating = homestayService.calculateAverageRating(homestay);
                                        boolean isNew = false; // hoặc logic xác định
                                        boolean isPopular = false; // hoặc logic xác định

                                        return HomestayMapper.toHomestaySearchResponse(
                                                        homestay,
                                                        amenities,
                                                        minPrice,
                                                        percentDiscount,
                                                        rating,
                                                        isNew,
                                                        isPopular);
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
