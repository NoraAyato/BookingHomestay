package com.bookinghomestay.app.application.admin.topic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TopicStatsDataReponse {
    private int total;
    private int active;
    private int inactive;
    private int totalArticles;
}
