package com.bookinghomestay.app.application.host.service.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HostServiceUpdateRequestDto {
    private String name;
    private String description;
    private MultipartFile image;
    private int price;
    private String homestayId;
}
