package com.bookinghomestay.app.application.admin.news.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewsCreateRequestDto {
    private String title;
    private String content;
    private String status;
    private String category;
    private boolean featured;
    private MultipartFile image;
}
