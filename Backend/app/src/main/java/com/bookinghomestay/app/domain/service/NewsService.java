package com.bookinghomestay.app.domain.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.model.TinTuc;

@Service
public class NewsService {
    public boolean filterBySearch(TinTuc news, String search) {
        if (search == null || search.trim().isEmpty()) {
            return true;
        }

        String searchLower = search.toLowerCase().trim();

        // Tìm trong mã khuyến mãi
        if (news.getMaTinTuc() != null &&
                news.getMaTinTuc().toLowerCase().contains(searchLower)) {
            return true;
        }

        // Tìm trong nội dung
        if (news.getNoiDung() != null &&
                news.getNoiDung().toLowerCase().contains(searchLower)) {
            return true;
        }

        return false;
    }

    public boolean filterByStatus(TinTuc news, String status) {
        if (status == null || status.trim().isEmpty()) {
            return true;
        }

        return news.getTrangThai() != null && news.getTrangThai().equalsIgnoreCase(status);
    }

    public boolean filterByCategory(TinTuc news, String category) {
        if (category == null || category.trim().isEmpty()) {
            return true;
        }

        return news.getChuDe() != null && news.getChuDe().getTenChuDe().equalsIgnoreCase(category);
    }

    public boolean filterByDateRange(TinTuc news, LocalDate startDate, LocalDate endDate) {
        if (startDate == null && endDate == null) {
            return true;
        }

        LocalDateTime newsStart = news.getNgayDang();

        if (startDate != null) {
            LocalDateTime queryStartDateTime = LocalDateTime.of(startDate, LocalTime.MIN);
            if (newsStart.isBefore(queryStartDateTime)) {
                return false;
            }
        }

        if (endDate != null) {
            LocalDateTime queryEndDateTime = LocalDateTime.of(endDate, LocalTime.MAX);
            if (newsStart.isAfter(queryEndDateTime)) {
                return false;
            }
        }

        return true;
    }
}
