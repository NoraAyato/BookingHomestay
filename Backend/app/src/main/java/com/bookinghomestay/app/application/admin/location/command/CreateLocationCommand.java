package com.bookinghomestay.app.application.admin.location.command;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateLocationCommand {
    private String name;
    private String description;
    private MultipartFile image;
}
