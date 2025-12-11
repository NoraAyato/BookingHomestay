package com.bookinghomestay.app.application.host.homestay.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HostHomestayUpdateRequestDto {
    private String name;
    private String description;
    private String address;
    private String locationId;
    private String status;
    private MultipartFile image;
}
