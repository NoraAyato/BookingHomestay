package com.bookinghomestay.app.application.host.reviews.query;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.reviews.dto.ReviewsDataResponseDto;
import com.bookinghomestay.app.application.admin.reviews.query.GetReviewsDataQuery;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.common.util.PaginationUtil;
import com.bookinghomestay.app.domain.model.DanhGia;
import com.bookinghomestay.app.domain.repository.IReviewRepository;
import com.bookinghomestay.app.domain.service.ReviewService;
import com.bookinghomestay.app.infrastructure.mapper.ReviewMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetHostReviewsDataQueryHandler {
    private final IReviewRepository reviewsRepository;
    private final ReviewService reviewService;

    public PageResponse<ReviewsDataResponseDto> handle(GetHostReviewsDataQuery query) {
        List<DanhGia> danhGias = reviewsRepository.getAll().stream()
                .filter(dg -> dg.getHomestay().getNguoiDung().getUserId().equalsIgnoreCase(query.getUserId()))
                .toList();
        List<DanhGia> filtered = danhGias.stream()
                .filter(dg -> (query.getHomestayId() == null
                        || dg.getHomestay().getIdHomestay().equalsIgnoreCase(query.getHomestayId())))
                .filter(dg -> (query.getRating() == null
                        || query.getRating() >= reviewService.calculateAverageRating(dg)))
                .filter(dg -> (query.getSearch() == null || query.getSearch().isEmpty()
                        || dg.getPhieuDatPhong().getNguoiDung().getFirstName().toLowerCase()
                                .contains(query.getSearch().toLowerCase())
                        || dg.getHomestay().getTenHomestay().toLowerCase()
                                .contains(query.getSearch().toLowerCase())))
                .filter(dg -> (query.getStartDate() == null
                        || !dg.getNgayDanhGia().toLocalDate().isBefore(query.getStartDate())))
                .filter(dg -> (query.getEndDate() == null
                        || !dg.getNgayDanhGia().toLocalDate().isAfter(query.getEndDate())))
                .toList();
        int totalElements = filtered.size();
        List<DanhGia> paged = PaginationUtil.paginate(
                filtered,
                query.getPage(),
                query.getSize());
        List<ReviewsDataResponseDto> dtos = paged.stream()
                .map(dg -> ReviewMapper.toReviewData(dg))
                .toList();
        return new PageResponse<>(dtos, totalElements, query.getPage(), query.getSize());
    }
}
