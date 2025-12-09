package com.bookinghomestay.app.application.admin.news.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.repository.INewsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NewsDeleteCommandHandler {
    private final INewsRepository newsRepository;

    public void handle(String id) {
        try {
            var news = newsRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tức !"));
            newsRepository.deleteById(news.getMaTinTuc());
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi xóa tin tức: " + e.getMessage());
        }
    }
}
