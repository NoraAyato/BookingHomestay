// GetHomestayReviewsQueryHandler.java
package com.bookinghomestay.app.application.danhgia.query;

import com.bookinghomestay.app.application.homestay.dto.HomestayReviewResponseDto;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.domain.model.DanhGia;
import com.bookinghomestay.app.domain.repository.IReviewRepository;
import com.bookinghomestay.app.infrastructure.mapper.ReviewMapper;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetHomestayReviewsQueryHandler {

    private final IReviewRepository danhGiaRepository;

    @Transactional
    public PageResponse<HomestayReviewResponseDto> handle(GetHomestayReviewsQuery query) {
        List<DanhGia> danhGias = danhGiaRepository.findByHomestay_IdHomestay(query.getHomestayId());
        int total = danhGias.size();
        int page = query.getPage();
        int limit = query.getLimit();
        List<HomestayReviewResponseDto> reviewDtos = danhGias.stream()
                .skip((long) (page - 1) * limit)
                .limit(limit)
                .map(ReviewMapper::toResponseDto).collect(Collectors.toList());

        PageResponse<HomestayReviewResponseDto> response = new PageResponse<>();
        response.setItems(reviewDtos);
        response.setPage(page);
        response.setLimit(limit);
        response.setTotal(total);
        return response;
    }
}