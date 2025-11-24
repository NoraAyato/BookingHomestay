package com.bookinghomestay.app.application.admin.dashboard.query;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.dashboard.dto.DashboardNewsDto;
import com.bookinghomestay.app.domain.repository.INewsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetNewsInfoQueryHandler {
        private final INewsRepository newsRepository;

        public List<DashboardNewsDto> handle() {
                var newsInfo = newsRepository.finAllOderByCreateTime(5);
                List<DashboardNewsDto> result = newsInfo.stream()
                                .map(news -> DashboardNewsDto.builder()
                                                .id(news.getMaTinTuc())
                                                .title(news.getTieuDe())
                                                .status(news.getTrangThai())
                                                .views("0")
                                                .date(news.getNgayDang() != null
                                                                ? news.getNgayDang().toLocalDate().toString()
                                                                : "")
                                                .build())
                                .toList();
                return result;
        }
}
