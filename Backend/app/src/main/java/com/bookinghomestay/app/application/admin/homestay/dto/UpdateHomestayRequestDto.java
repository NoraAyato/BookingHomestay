package com.bookinghomestay.app.application.admin.homestay.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateHomestayRequestDto {
    private String homestayName;
    private String description;
    private String idHost;
    private String address;
    private String locationId;
    private String status;
    private MultipartFile image;
}
