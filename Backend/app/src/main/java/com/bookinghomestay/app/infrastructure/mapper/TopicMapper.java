package com.bookinghomestay.app.infrastructure.mapper;

import com.bookinghomestay.app.application.admin.topic.dto.TopicDataResponseDto;
import com.bookinghomestay.app.domain.model.ChuDe;

public class TopicMapper {
    public static TopicDataResponseDto toDto(ChuDe topic) {
        return new TopicDataResponseDto(
                topic.getIdChuDe(),
                topic.getTenChuDe(),
                topic.getMoTa(),
                topic.getTinTucs() != null ? topic.getTinTucs().size() : 0,
                topic.isTrangThai());
    }
}
