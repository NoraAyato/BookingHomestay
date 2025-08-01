package com.bookinghomestay.app.infrastructure.file;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@Service
public class FileStorageService {

    private static final String AVATAR_UPLOAD_DIR = "src/main/resources/static/img/uploads/avatars";
    private static final String AVATAR_PUBLIC_PATH = "/img/users/";

    public String storeAvatar(MultipartFile file, String userId) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Ảnh đại diện không hợp lệ");
        }

        try {
            // Tạo thư mục nếu chưa tồn tại
            Path uploadPath = Paths.get(AVATAR_UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Tạo tên file duy nhất
            String originalFileName = file.getOriginalFilename();
            String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String filename = userId + "_" + System.currentTimeMillis() + extension;

            // Lưu file vào ổ đĩa
            Path filePath = uploadPath.resolve(filename);
            file.transferTo(filePath.toFile());

            // Trả về đường dẫn tương đối
            return AVATAR_PUBLIC_PATH + filename;

        } catch (IOException e) {
            throw new RuntimeException("Không thể lưu ảnh đại diện", e);
        }
    }
}
