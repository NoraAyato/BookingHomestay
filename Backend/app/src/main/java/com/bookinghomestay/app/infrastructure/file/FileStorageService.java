package com.bookinghomestay.app.infrastructure.file;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import co.elastic.clients.util.DateTime;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@Service
public class FileStorageService {

    private static final String AVATAR_UPLOAD_DIR = System.getProperty("user.dir") + "/img/uploads/avatars/";
    private static final String AVATAR_PUBLIC_PATH = "/img/uploads/avatars/";
    private static final String REVIEW_IMAGE_UPLOAD_DIR = System.getProperty("user.dir") + "/img/uploads/reviews/";
    private static final String REVIEW_IMAGE_PUBLIC_PATH = "/img/uploads/reviews/";
    private static final String HOMESTAY_IMAGE_UPLOAD_DIR = System.getProperty("user.dir") + "/img/uploads/homestays/";
    private static final String HOMESTAY_IMAGE_PUBLIC_PATH = "/img/uploads/homestays/";
    private static final String ROOM_IMAGE_UPLOAD_DIR = System.getProperty("user.dir") + "/img/uploads/rooms/";
    private static final String ROOM_IMAGE_PUBLIC_PATH = "/img/uploads/rooms/";
    private static final String NEW_IMAGE_UPLOAD_DIR = System.getProperty("user.dir") + "/img/uploads/news/";
    private static final String NEW_IMAGE_PUBLIC_PATH = "/img/uploads/news/";
    private static final String SERVICE_IMAGE_UPLOAD_DIR = System.getProperty("user.dir") + "/img/uploads/services/";
    private static final String SERVICE_IMAGE_PUBLIC_PATH = "/img/uploads/services/";
    private static final String LOCATION_IMAGE_UPLOAD_DIR = System.getProperty("user.dir") + "/img/uploads/locations/";
    private static final String LOCATION_IMAGE_PUBLIC_PATH = "/img/uploads/locations/";
    private static final String PROMOTION_IMAGE_UPLOAD_DIR = System.getProperty("user.dir")
            + "/img/uploads/promotions/";
    private static final String PROMOTION_IMAGE_PUBLIC_PATH = "/img/uploads/promotions/";

    public String storeAvatar(MultipartFile file, String userId) {
        return storeImage(file, userId, AVATAR_UPLOAD_DIR, AVATAR_PUBLIC_PATH);
    }

    public String storeNew(MultipartFile file, String headString) {
        return storeImage(file, headString, NEW_IMAGE_UPLOAD_DIR, NEW_IMAGE_PUBLIC_PATH);
    }

    public String storePromotion(MultipartFile file, String headString) {
        return storeImage(file, headString, PROMOTION_IMAGE_UPLOAD_DIR, PROMOTION_IMAGE_PUBLIC_PATH);
    }

    public String storeService(MultipartFile file, String headString) {
        return storeImage(file, headString, SERVICE_IMAGE_UPLOAD_DIR, SERVICE_IMAGE_PUBLIC_PATH);
    }

    public String storeLocation(MultipartFile file, String headString) {
        return storeImage(file, headString, LOCATION_IMAGE_UPLOAD_DIR, LOCATION_IMAGE_PUBLIC_PATH);
    }

    public String storeReview(MultipartFile file, String headString) {
        return storeImage(file, headString, REVIEW_IMAGE_UPLOAD_DIR, REVIEW_IMAGE_PUBLIC_PATH);
    }

    public String storeHomestayImage(MultipartFile file, String headString) {
        return storeImage(file, headString, HOMESTAY_IMAGE_UPLOAD_DIR, HOMESTAY_IMAGE_PUBLIC_PATH);
    }

    public String storeRoomImage(MultipartFile file, String headString) {
        return storeImage(file, headString, ROOM_IMAGE_UPLOAD_DIR, ROOM_IMAGE_PUBLIC_PATH);
    }

    private String storeImage(MultipartFile file, String headString, String path, String publicPath) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Ảnh không hợp lệ");
        }

        try {
            Path uploadPath = Paths.get(path);
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
            long maxSize = 5 * 1024 * 1024; // 5MB
            if (file.getSize() > maxSize) {
                throw new RuntimeException("Ảnh vượt quá kích thước tối đa cho phép (5MB)");
            }

            String filename = headString + "_" + System.currentTimeMillis() + extension;
            Path filePath = uploadPath.resolve(filename);
            file.transferTo(filePath.toFile());
            return publicPath + filename;

        } catch (IOException e) {
            throw new RuntimeException("Không thể lưu ảnh", e);
        }
    }

}
