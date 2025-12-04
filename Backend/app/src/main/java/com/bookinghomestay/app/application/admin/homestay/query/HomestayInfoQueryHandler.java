package com.bookinghomestay.app.application.admin.homestay.query;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import com.bookinghomestay.app.application.admin.homestay.dto.HomestayInfoResponseDto;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.service.HomestayService;
import com.bookinghomestay.app.infrastructure.mapper.HomestayMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HomestayInfoQueryHandler {
    private final IHomestayRepository homestayRepository;
    private final HomestayService homestayService;

    public PageResponse<HomestayInfoResponseDto> handle(HomestayInfoQuery query) {
        Pageable pageable = PageRequest.of(query.getPage() - 1, query.getSize());
        Page<Homestay> homestayPage = homestayRepository.findBySearch(query.getSearch(), pageable);
        List<HomestayInfoResponseDto> dtos = homestayPage.getContent().stream()
                .filter(hs -> {
                    if (query.getStatus() == null || query.getStatus().isEmpty())
                        return true;
                    return hs.getTrangThai().equalsIgnoreCase(query.getStatus());
                })
                .filter(hs -> {
                    if (query.getLocationId() == null || query.getLocationId().isEmpty())
                        return true;
                    return hs.getKhuVuc() != null && hs.getKhuVuc().getMaKv().equalsIgnoreCase(query.getLocationId());
                })
                .filter(hs -> {
                    if (query.getMinPrice() == null)
                        return true;
                    return homestayService.caculateMinRoomPriceByHomestay(hs).doubleValue() >= query.getMinPrice()
                            .doubleValue();
                })
                .filter(hs -> {
                    if (query.getMinRoom() == null)
                        return true;
                    return hs.getPhongs() != null && hs.getPhongs().size() >= query.getMinRoom();
                })
                .filter(hs -> {
                    if (query.getRating() == null)
                        return true;
                    return homestayService.calculateAverageRating(hs) >= query.getRating().doubleValue();
                })
                .filter(hs -> {
                    if (query.getRevenue() == null)
                        return true;
                    return homestayService.calculateRevenueByHomestay(hs) >= query.getRevenue().doubleValue();
                })
                .map(homestay -> {
                    int roomCount = homestay.getPhongs() != null ? homestay.getPhongs().size() : 0;
                    int bookingCount = homestayService.countBookingByHomestay(homestay);
                    double averageRating = homestayService.calculateAverageRating(homestay);
                    double minPrice = homestayService.caculateMinRoomPriceByHomestay(homestay).doubleValue();
                    int reviews = homestay.getDanhGias() != null ? homestay.getDanhGias().size() : 0;
                    double revenue = homestayService.calculateRevenueByHomestay(homestay);
                    return HomestayMapper.toHomestayInfoResponseDto(homestay, averageRating, reviews, roomCount,
                            bookingCount, revenue, minPrice);
                })
                .collect(Collectors.toList());
        return new PageResponse<>(dtos, (int) homestayPage.getTotalElements(), query.getPage(), query.getSize());

    }
}
