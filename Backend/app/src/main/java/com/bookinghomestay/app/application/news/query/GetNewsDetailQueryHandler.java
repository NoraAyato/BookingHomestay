package com.bookinghomestay.app.application.news.query;

import com.bookinghomestay.app.domain.model.TinTuc;
import com.bookinghomestay.app.domain.repository.INewsRepository;
import com.bookinghomestay.app.application.news.dto.NewsDetailResponseDto;
import com.bookinghomestay.app.domain.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetNewsDetailQueryHandler {

    private final INewsRepository newsRepository;

    public NewsDetailResponseDto handle(GetNewsDetailQuery query) {
        TinTuc tt = newsRepository.findById(query.getMaTinTuc())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Không tìm thấy tin tức với mã: " + query.getMaTinTuc()));

        return NewsDetailResponseDto.builder()
                .id(tt.getMaTinTuc())
                .title(tt.getTieuDe())
                .content(tt.getNoiDung())
                .image(tt.getHinhAnh())
                .author(tt.getTacGia())
                .createdAt(tt.getNgayDang())
                .category(tt.getChuDe().getTenChuDe())
                .build();
    }
}
