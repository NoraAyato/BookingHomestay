package com.bookinghomestay.app.application.news.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsResponseDto {
    private String id;
    private String title;
    private String content;
    private String image;
    private String category;
    private String author;
    private Boolean isFeatured;
    private LocalDateTime createdAt;
}