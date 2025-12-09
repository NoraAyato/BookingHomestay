package com.bookinghomestay.app.application.admin.news.command;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.ChuDe;
import com.bookinghomestay.app.domain.model.TinTuc;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.INewsRepository;
import com.bookinghomestay.app.domain.repository.ITopicRepository;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.infrastructure.file.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NewsCreateCommandHandler {
    private final INewsRepository newsRepository;
    private final ITopicRepository topicRepository;
    private final FileStorageService fileStorageService;
    private final IUserRepository userRepository;

    public void handle(NewsCreateCommand command) {
        try {
            User user = userRepository.findById(command.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            ChuDe topic = topicRepository.findById(command.getCategory())
                    .orElseThrow(() -> new IllegalArgumentException("Topic not found"));
            if (command.getImage() == null) {
                throw new IllegalArgumentException("Image file is required");
            }
            String imageUrl = fileStorageService.storeNew(command.getImage(), "news_");
            TinTuc news = new TinTuc();
            news.setMaTinTuc("NEWS-" + UUID.randomUUID().toString().substring(0, 7));
            news.setTieuDe(command.getTitle());
            news.setNoiDung(command.getContent());
            news.setTrangThai(command.getStatus());
            news.setFeatured(command.isFeatured());
            news.setHinhAnh(imageUrl);
            news.setChuDe(topic);
            news.setTacGia("admin");
            news.setNgayDang(LocalDateTime.now());
            newsRepository.save(news);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create news" + e.toString(), e);
        }

    }
}
