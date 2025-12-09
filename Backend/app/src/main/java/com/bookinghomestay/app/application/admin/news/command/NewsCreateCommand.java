package com.bookinghomestay.app.application.admin.news.command;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsCreateCommand {
    private String userId;
    private String title;
    private String content;
    private String status;
    private String category;
    private boolean featured;
    private MultipartFile image;
}
