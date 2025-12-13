package com.bookinghomestay.app.application.host.service.dto;

import org.springframework.web.multipart.MultipartFile;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HostServiceCreateRequestDto {
    private String name;
    private String description;
    private int price;
    private String homestayId;
    private MultipartFile image;
}
