package com.bookinghomestay.app.application.admin.news.query;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.news.dto.NewsStatsResponseDto;
import com.bookinghomestay.app.domain.model.TinTuc;
import com.bookinghomestay.app.domain.repository.INewsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetNewsStatsQueryHandler {
    private final INewsRepository newsRepository;

    public NewsStatsResponseDto handle() {
        List<TinTuc> newsList = newsRepository.findAll();
        int total = newsList.size();
        int published = newsList.stream()
                .filter(news -> "Published".equalsIgnoreCase(news.getTrangThai()))
                .toList()
                .size();
        int draft = (int) newsList.stream()
                .filter(news -> "Draft".equalsIgnoreCase(news.getTrangThai()))
                .count();
        int featured = (int) newsList.stream()
                .filter(TinTuc::getFeatured)
                .count();

        return new NewsStatsResponseDto(total, published, draft, featured);
    }
}
