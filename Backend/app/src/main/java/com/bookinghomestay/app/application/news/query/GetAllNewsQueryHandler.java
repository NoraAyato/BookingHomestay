package com.bookinghomestay.app.application.news.query;

import com.bookinghomestay.app.application.news.dto.NewsResponseDto;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.domain.model.TinTuc;
import com.bookinghomestay.app.domain.repository.INewsRepository;
import com.bookinghomestay.app.infrastructure.mapper.NewsMapper;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetAllNewsQueryHandler {

    private final INewsRepository newsRepository;

    @Transactional
    public PageResponse<NewsResponseDto> handle(GetAllNewsQuery query) {
        List<TinTuc> newsList = newsRepository.findAllPublished();
        int total = newsList.size();
        List<NewsResponseDto> pagedNews = newsList.stream()
                .skip((long) (query.getPage() - 1) * query.getSize())
                .limit(query.getSize())
                .filter(tt -> query.getTopic() == null
                        || tt.getChuDe().getIdChuDe().equalsIgnoreCase(query.getTopic()))
                .filter(tt -> tt.getChuDe().isTrangThai())
                .map(tt -> {
                    return NewsMapper.toNewsResponseDto(
                            tt.getMaTinTuc(),
                            tt.getTieuDe(),
                            tt.getNoiDung(),
                            tt.getHinhAnh(),
                            tt.getChuDe().getTenChuDe(),
                            tt.getTacGia(),
                            tt.getFeatured(),
                            tt.getNgayDang());
                })
                .collect(Collectors.toList());

        return new PageResponse<>(pagedNews, query.getPage(), query.getSize(), total);
    }
}
