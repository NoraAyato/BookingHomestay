package com.bookinghomestay.app.application.news.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsDetailResponseDto {
    private String maTinTuc;
    private String tieuDe;
    private String noiDung;
    private String hinhAnh;
    private String tacGia;
    private LocalDateTime ngayDang;
    private String trangThai;
    private String tenChuDe;
}
