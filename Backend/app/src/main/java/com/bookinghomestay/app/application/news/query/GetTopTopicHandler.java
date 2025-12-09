package com.bookinghomestay.app.application.news.query;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.news.dto.TopicsResponseDto;
import com.bookinghomestay.app.domain.repository.ITopicRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetTopTopicHandler {
    private final ITopicRepository topicRepository;

    public List<TopicsResponseDto> handle() {
        var topics = topicRepository.getAvailableTopic();
        List<TopicsResponseDto> topTopics = topics.stream().filter(tp-> tp.isTrangThai())
                .map(tp -> new TopicsResponseDto(tp.getIdChuDe(), tp.getTenChuDe())).toList();
        return topTopics;
    }
}
