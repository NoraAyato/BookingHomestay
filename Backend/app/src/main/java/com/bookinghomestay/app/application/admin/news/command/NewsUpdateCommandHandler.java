package com.bookinghomestay.app.application.admin.news.command;

import java.nio.file.FileStore;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.news.dto.NewsUpdateRequestDto;
import com.bookinghomestay.app.domain.repository.INewsRepository;
import com.bookinghomestay.app.domain.repository.ITopicRepository;
import com.bookinghomestay.app.infrastructure.file.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NewsUpdateCommandHandler {
    private final INewsRepository newsRepository;
    private final FileStorageService fileStorageService;
    private final ITopicRepository topicRepository;

    public void handle(NewsUpdateRequestDto dto, String id) {
        try {
            var news = newsRepository.findById(id).orElseThrow(() -> new RuntimeException("News not found"));
            news.setTieuDe(dto.getTitle());
            news.setNoiDung(dto.getContent());
            news.setTrangThai(dto.getStatus());
            if (dto.getImage() != null) {
                String imagePath = fileStorageService.storeNew(dto.getImage(), "news_");
                news.setHinhAnh(imagePath);
            }
            var topic = topicRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Topic not found" + dto.getCategoryId()));
            news.setChuDe(topic);
            news.setFeatured(dto.isFeatured());

            newsRepository.save(news);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update news" + e.toString(), e);
        }

    }
}
