package com.bookinghomestay.app.domain.service;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.model.User;

@Service
public class UserService {
    public String removeDiacritics(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
    }

    public String getJoinedTime(LocalDateTime createdAt) {
        if (createdAt == null) {
            return "Unknown";
        }
        int month = createdAt.getMonthValue();
        int year = createdAt.getYear();
        return String.format("Tháng %d, Năm %d", month, year);
    }

    public long countUsers(List<User> users, LocalDateTime start, LocalDateTime end) {
        return users.stream()
                .filter(u -> u.getCreatedAt() != null)
                .filter(u -> !u.getCreatedAt().isBefore(start) && u.getCreatedAt().isBefore(end))
                .count();
    }

    public int countBookingComplete(User user) {

        int count = 0;
        List<PhieuDatPhong> bookings = user.getDanhSachPhieu();
        for (PhieuDatPhong booking : bookings) {
            if ("Completed".equals(booking.getTrangThai())) {
                count++;
            }
        }
        return count;
    }
}
