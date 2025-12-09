package com.bookinghomestay.app.application.admin.news.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewsDataResponseDto {
    private String id;
    private String title;
    private String content;
    private String category;
    private String status;
    private boolean featured;
    private String author;
    private String image;
    private LocalDate createdAt;
}
