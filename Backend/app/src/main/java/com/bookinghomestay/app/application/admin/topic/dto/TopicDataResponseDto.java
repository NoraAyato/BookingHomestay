package com.bookinghomestay.app.application.admin.topic.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopicDataResponseDto {
    private String id;
    private String name;
    private String description;
    private int articleCount;
    private boolean isActive;

}
