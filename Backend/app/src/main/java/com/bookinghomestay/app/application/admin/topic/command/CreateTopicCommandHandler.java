package com.bookinghomestay.app.application.admin.topic.command;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.topic.dto.TopicCreateRequestDto;
import com.bookinghomestay.app.domain.model.ChuDe;
import com.bookinghomestay.app.domain.repository.ITopicRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateTopicCommandHandler {
    private final ITopicRepository topicRepository;

    public void handler(TopicCreateRequestDto dto) {
        try {
            ChuDe topic = new ChuDe();
            topic.setIdChuDe("TP-" + UUID.randomUUID().toString().substring(0, 7));
            topic.setMoTa(dto.getDescription());
            topic.setTenChuDe(dto.getName());
            topic.setTrangThai(true);
            topicRepository.save(topic);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo chủ đề ");
        }
    }
}
