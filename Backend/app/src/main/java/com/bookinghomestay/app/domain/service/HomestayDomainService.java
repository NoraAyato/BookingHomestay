package com.bookinghomestay.app.domain.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.Phong;

@Service
public class HomestayDomainService {

    /**
     * Kiểm tra phòng có khả dụng trong khoảng thời gian
     */
    public boolean isRoomAvailable(Phong phong, LocalDate checkIn, LocalDate checkOut) {
        // Logic kiểm tra phòng có sẵn trong khoảng thời gian
        // Thực tế logic này nên được thực hiện ở repository
        return true;
    }

    /**
     * Lọc danh sách các phòng khả dụng
     */
    public List<Phong> filterAvailableRooms(List<Phong> rooms, LocalDate checkIn, LocalDate checkOut) {
        return rooms.stream()
                .filter(room -> isRoomAvailable(room, checkIn, checkOut))
                .collect(Collectors.toList());
    }

    /**
     * Tính điểm đánh giá trung bình của homestay
     */
    public double calculateAverageRating(List<Double> ratings) {
        if (ratings == null || ratings.isEmpty()) {
            return 0.0;
        }

        return ratings.stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);
    }

    /**
     * Tìm hình ảnh chính của phòng
     */
    public String findMainRoomImage(Phong phong) {
        return phong.getHinhAnhPhongs().stream()
                .filter(h -> h.isLaAnhChinh())
                .findFirst()
                .map(h -> h.getUrlAnh())
                .orElse(null);
    }

    /**
     * Kiểm tra tính hợp lệ của Homestay
     */
    public boolean validateHomestay(Homestay homestay) {
        // Kiểm tra các điều kiện cơ bản
        if (homestay == null) {
            return false;
        }

        if (homestay.getTenHomestay() == null || homestay.getTenHomestay().trim().isEmpty()) {
            return false;
        }

        if (homestay.getDiaChi() == null || homestay.getDiaChi().trim().isEmpty()) {
            return false;
        }

        // Kiểm tra có ít nhất một phòng
        if (homestay.getPhongs() == null || homestay.getPhongs().isEmpty()) {
            return false;
        }

        // Kiểm tra có chính sách
        if (homestay.getChinhSachs() == null || homestay.getChinhSachs().isEmpty()) {
            return false;
        }

        return true;
    }
}
