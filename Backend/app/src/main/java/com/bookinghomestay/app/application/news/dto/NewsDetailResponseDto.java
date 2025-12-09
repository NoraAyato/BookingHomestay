package com.bookinghomestay.app.application.news.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsDetailResponseDto {
    private String id;
    private String title;
    private String content;
    private String image;
    private String category;
    private LocalDateTime createdAt;
    private String author;
}
