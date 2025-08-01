package com.bookinghomestay.app.application.users.command;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UploadUserPictureCommand {
    private final String userId;
    private final MultipartFile file;

}
