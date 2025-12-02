package com.bookinghomestay.app.application.admin.homestay.command;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateHomestayInfoCommand {
    private String id;
    private String homestayName;
    private String description;
    private String idHost;
    private String address;
    private String locationId;
    private String status;
    private MultipartFile image;
}
