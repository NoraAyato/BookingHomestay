package com.bookinghomestay.app.application.admin.location.dto;

import org.springframework.web.multipart.MultipartFile;

import jakarta.mail.Multipart;
import lombok.Data;

@Data
public class CreateLocationRequestDto {
    private String name;
    private String description;
    private MultipartFile image;
}
