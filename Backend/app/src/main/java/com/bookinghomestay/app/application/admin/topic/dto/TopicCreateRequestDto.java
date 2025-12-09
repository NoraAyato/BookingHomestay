package com.bookinghomestay.app.application.admin.topic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopicCreateRequestDto {
    private String name;
    private String description;
}
