package com.bookinghomestay.app.application.admin.news.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewsStatsResponseDto {
    private int total;
    private int published;
    private int draft;
    private int featured;
}
