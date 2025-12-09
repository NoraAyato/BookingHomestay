package com.bookinghomestay.app.domain.service;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.DanhGia;

@Service
public class ReviewService {
    public int calculateAverageRating(DanhGia danhGia) {
        return (int) Math.floor((danhGia.getDichVu() + danhGia.getTienIch() + danhGia.getSachSe()) / 3.0);
    }
}
