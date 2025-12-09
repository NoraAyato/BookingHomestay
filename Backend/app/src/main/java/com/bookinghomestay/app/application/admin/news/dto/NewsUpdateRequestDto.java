package com.bookinghomestay.app.application.admin.news.dto;

import org.springframework.web.multipart.MultipartFile;

import jakarta.mail.Multipart;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewsUpdateRequestDto {
    private String title;
    private String content;
    private String status;
    private String categoryId;
    private MultipartFile image;
    private boolean featured;
}
