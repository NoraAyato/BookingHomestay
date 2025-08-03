package com.bookinghomestay.app.api.dto.homestay;

import java.math.BigDecimal;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HomestayDetailResponseDto {
    private String id;
    private String tenHomestay;
    private String diaChi;
    private String gioiThieu;
    private BigDecimal giaTien;
    private BigDecimal hang;
    private ChinhSachDto chinhSach;
    private int tongDanhGia;
    private double diemHaiLongTrungBinh;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ChinhSachDto {
        private String nhanPhong;
        private String traPhong;
        private String huyPhong;
        private String buaAn;
    }
}
