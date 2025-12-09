package com.bookinghomestay.app.application.admin.topic.command;

import org.springframework.boot.autoconfigure.kafka.KafkaProperties.Retry.Topic;
import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.topic.dto.TopicUpdateRequestDto;
import com.bookinghomestay.app.domain.repository.ITopicRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UpdateTopicCommandHandler {
    private final ITopicRepository topicRepository;

    public void handle(String id, TopicUpdateRequestDto dto) {

        // Kiểm tra topic có tồn tại không
        var topicOptional = topicRepository.findById(id);
        if (topicOptional.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy chủ đề!");
        }

        // Tìm chủ đề trùng tên
        var existing = topicRepository.getAll().stream()
                .filter(t -> t.getTenChuDe().equalsIgnoreCase(dto.getTitle()))
                .findFirst()
                .orElse(null);
        // Nếu tồn tại và không phải chính chủ đề đang sửa → báo lỗi
        if (existing != null && !existing.getIdChuDe().equals(id)) {
            throw new IllegalArgumentException("Tên chủ đề đã tồn tại!");
        }

        // Update
        var topic = topicOptional.get();
        topic.setTenChuDe(dto.getTitle());
        topic.setMoTa(dto.getDescription());
        topic.setTrangThai(dto.isStatus());

        topicRepository.save(topic);
    }

}
