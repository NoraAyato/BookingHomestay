package com.bookinghomestay.app.domain.service;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

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
}
