package com.bookinghomestay.app.application.admin.topic.query;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.topic.dto.TopicDataResponseDto;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.common.util.PaginationUtil;
import com.bookinghomestay.app.domain.model.ChuDe;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.model.TinTuc;
import com.bookinghomestay.app.domain.repository.ITopicRepository;
import com.bookinghomestay.app.infrastructure.mapper.TopicMapper;
import com.google.api.gax.paging.Page;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetTopicDataQueryHandler {
    private final ITopicRepository topicRepository;

    public PageResponse<TopicDataResponseDto> handle(GetTopicDataQuery query) {
        var topics = topicRepository.getAll();
        var topicDtos = topics.stream().filter(tp -> filterBySearch(tp, query.getSearch()))
                .filter(tp -> filterByStatus(tp, query.getStatus()))
                .collect(Collectors.toList());
        int total = topicDtos.size();
        List<ChuDe> pagedTopis = PaginationUtil.paginate(
                topicDtos,
                query.getPage(),
                query.getSize());
        List<TopicDataResponseDto> dtos = pagedTopis.stream()
                .map(tp -> TopicMapper.toDto(tp))
                .collect(Collectors.toList());
        return new PageResponse<>(dtos, total, query.getPage(), query.getSize());
    }

    private boolean filterBySearch(ChuDe topic, String search) {
        if (search == null || search.trim().isEmpty()) {
            return true;
        }

        String searchLower = search.toLowerCase().trim();

        if (topic.getTenChuDe() != null &&
                topic.getTenChuDe().toLowerCase().contains(searchLower)) {
            return true;
        }

        return false;
    }

    private boolean filterByStatus(ChuDe topic, String status) {
        if (status == null || status.trim().isEmpty()) {
            return true;
        }

        if (status.equalsIgnoreCase("active") && topic.isTrangThai()) {
            return true;
        }

        if (status.equalsIgnoreCase("inactive") && !topic.isTrangThai()) {
            return true;
        }

        return false;
    }
}
