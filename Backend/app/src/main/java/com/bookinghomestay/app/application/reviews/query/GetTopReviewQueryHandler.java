package com.bookinghomestay.app.application.reviews.query;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.reviews.dto.TopReviewResponseDto;
import com.bookinghomestay.app.domain.model.DanhGia;
import com.bookinghomestay.app.domain.repository.IReviewRepository;
import com.bookinghomestay.app.infrastructure.mapper.ReviewMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetTopReviewQueryHandler {
    private final IReviewRepository reviewRepository;

    public List<TopReviewResponseDto> handle() {
        List<DanhGia> reviews = reviewRepository.findBestReviewPerTop5Locations();
        List<TopReviewResponseDto> responseDtos = reviews.stream().map(rv -> {
            double rating = (rv.getDichVu() + rv.getTienIch() + rv.getSachSe()) / 3.0;
            double rounded = Math.round(rating * 10.0) / 10.0;
            return ReviewMapper.toTopReviewResponseDto(rv.getIdDG(),
                    rv.getNguoiDung().getFirstName() + " " + rv.getNguoiDung().getLastName(),
                    rv.getNguoiDung().getPicture(),
                    rv.getHomestay().getDiaChi() + "" + rv.getHomestay().getKhuVuc().getTenKv(),
                    rv.getBinhLuan(),
                    rounded,
                    rv.getHomestay().getTenHomestay(),
                    rv.getNgayDanhGia().toLocalDate(),
                    rv.getHinhAnh());
        }).toList();

        return responseDtos;
    }
}
