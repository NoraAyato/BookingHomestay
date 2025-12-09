package com.bookinghomestay.app.application.admin.topic.query;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.topic.dto.TopicStatsDataReponse;
import com.bookinghomestay.app.domain.model.ChuDe;
import com.bookinghomestay.app.domain.repository.ITopicRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetTopicStatsQueryHandler {
    private final ITopicRepository topicRepository;

    public TopicStatsDataReponse handler() {
        List<ChuDe> topics = topicRepository.getAll();
        int total = topics.size();
        int active = topics.stream().filter(ChuDe::isTrangThai).toList().size();
        int inactive = (int) topics.stream().filter(topic -> !topic.isTrangThai()).count();
        int totalArticles = topics.stream().mapToInt(topic -> topic.getTinTucs().size()).sum();
        return new TopicStatsDataReponse(total, active, inactive, totalArticles);
    }
}
