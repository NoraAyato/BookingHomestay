package com.bookinghomestay.app.application.admin.locationmanager.command;

import org.springframework.web.multipart.MultipartFile;

import jakarta.mail.Multipart;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateLocationCommand {
    private String id;
    private String name;
    private String description;
    private MultipartFile image;
    private String status;
}
