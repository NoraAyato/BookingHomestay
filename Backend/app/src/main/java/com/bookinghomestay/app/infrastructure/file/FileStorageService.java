package com.bookinghomestay.app.infrastructure.file;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@Service
public class FileStorageService {

    private static final String AVATAR_UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/avatars/";
    private static final String AVATAR_PUBLIC_PATH = "/avatars/";

    public String storeAvatar(MultipartFile file, String userId) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Ảnh đại diện không hợp lệ");
        }

        try {
            Path uploadPath = Paths.get(AVATAR_UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFileName = file.getOriginalFilename();
            if (originalFileName == null || !originalFileName.contains(".")) {
                throw new RuntimeException("Tên file không hợp lệ");
            }

            String extension = originalFileName.substring(originalFileName.lastIndexOf(".")).toLowerCase();
            List<String> allowedExtensions = List.of(".jpg", ".jpeg", ".png", ".gif");
            if (!allowedExtensions.contains(extension)) {
                throw new RuntimeException("Định dạng ảnh không được hỗ trợ");
            }
            long maxSize = 2 * 1024 * 1024; // 2MB
            if (file.getSize() > maxSize) {
                throw new RuntimeException("Ảnh vượt quá kích thước tối đa cho phép (2MB)");
            }

            String filename = userId + "_" + System.currentTimeMillis() + extension;
            Path filePath = uploadPath.resolve(filename);
            file.transferTo(filePath.toFile());
            System.out.println("Avatar stored at: " + filePath.toString());
            return AVATAR_PUBLIC_PATH + filename;

        } catch (IOException e) {
            System.out.println("Error storing avatar: " + e.getMessage());
            throw new RuntimeException("Không thể lưu ảnh đại diện", e);
        }
    }

}
