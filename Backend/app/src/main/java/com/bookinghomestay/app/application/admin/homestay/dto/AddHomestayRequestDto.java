package com.bookinghomestay.app.application.admin.homestay.dto;

import org.springframework.web.multipart.MultipartFile;

import jakarta.mail.Multipart;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddHomestayRequestDto {
    private String homestayName;
    private String description;
    private String idHost;
    private String address;
    private String locationId;
    @NotEmpty(message = "Hình ảnh không được để trống")
    private MultipartFile image;
}
