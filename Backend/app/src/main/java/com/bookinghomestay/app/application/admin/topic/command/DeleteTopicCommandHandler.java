package com.bookinghomestay.app.application.admin.topic.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.ChuDe;
import com.bookinghomestay.app.domain.repository.ITopicRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeleteTopicCommandHandler {
    private final ITopicRepository topicRepository;

    public void handle(String id) {
        var topicOptional = topicRepository.findById(id);
        if (topicOptional.isPresent()) {
            ChuDe topic = topicOptional.get();
            if (topic.getTinTucs() != null && topic.getTinTucs().size() > 0) {
                throw new RuntimeException("Không thể xóa chủ đề này vì có tin tức đang sử dụng chủ đề này !");
            }
            topic.setTrangThai(false);
            topicRepository.save(topic);
        } else {
            throw new IllegalArgumentException("Không tìm thấy chủ đề !");
        }
    }
}
