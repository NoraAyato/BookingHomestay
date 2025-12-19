package com.bookinghomestay.app.application.host.homestay.query;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.host.homestay.dto.HostHomestayDataResponseDto;
import com.bookinghomestay.app.application.host.service.dto.ServiceDataDto;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.common.util.PaginationUtil;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.service.HomestayService;
import com.bookinghomestay.app.infrastructure.mapper.HomestayMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetHomestayDataQueryHandler {
        private final IHomestayRepository homestayRepository;
        private final HomestayService homestayService;

        public PageResponse<HostHomestayDataResponseDto> handle(GetHomestayDataQuery query) {
                List<Homestay> homestays = homestayRepository.getHomestayByHostId(query.getHostId());
                List<Homestay> filteredList = homestays.stream()
                                .filter(homestay -> homestayService.filterHomestay(homestay, query))
                                .toList();
                filteredList = homestayService.sortHomestays(filteredList, query.getSortBy());
                int total = filteredList.size();
                List<Homestay> pagedHomestays = PaginationUtil.paginate(filteredList, query.getPage(), query.getSize());
                List<HostHomestayDataResponseDto> dtoList = pagedHomestays.stream()
                                .map(hs -> {
                                        double averageRating = homestayService.calculateAverageRating(hs);
                                        int totalReviews = hs.getDanhGias() != null ? hs.getDanhGias().size() : 0;
                                        int totalBookings = homestayService.countBookingByHomestay(hs);
                                        int revenue = (int) homestayService.calculateRevenueByHomestay(hs);

                                        List<String> amenities = homestayService.getHomestayAmenities(hs);
                                        List<ServiceDataDto> services = hs.getDichVus() != null ? hs.getDichVus()
                                                        .stream()
                                                        .map(dv -> new ServiceDataDto(dv.getMaDV(), hs.getIdHomestay(),
                                                                        hs.getTenHomestay(),
                                                                        dv.getTenDV(), dv.getDonGia().intValue(),
                                                                        dv.getMoTa(), dv.getHinhAnh()))
                                                        .collect(Collectors.toList()) : List.of();
                                        return HomestayMapper.toHostHomestayDataResponseDto(hs, averageRating,
                                                        totalReviews, totalBookings,
                                                        revenue, amenities, services);
                                })
                                .collect(Collectors.toList());
                return new PageResponse<>(dtoList, total, query.getPage(), query.getSize());
        }
}
