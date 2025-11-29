package com.bookinghomestay.app.application.users.command;

import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.infrastructure.file.FileStorageService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UploadUserImgCommandHandler {

    private final IUserRepository userRepository;
    private final FileStorageService fileStorageService;

    public void handle(UploadUserPictureCommand command) {
        User user = userRepository.findById(command.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng !"));

        MultipartFile file = command.getFile();
        if (file != null && !file.isEmpty()) {
            String relativePath = fileStorageService.storeAvatar(file, user.getUserId());
            user.setPicture(relativePath);
        }

        userRepository.save(user);
    }
}
