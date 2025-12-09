package com.bookinghomestay.app.application.admin.topic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopicUpdateRequestDto {
    private String title;
    private String description;
    private boolean status;
}
