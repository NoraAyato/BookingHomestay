package com.bookinghomestay.app.api.dto.homestay;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HomestayTienNghiResponseDto {
    private String homestayId;
    private List<TienNghiDto> tienNghis;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TienNghiDto {
        private String maTienNghi;
        private String tenTienNghi;
        private String moTa;
        private int soLuong;
    }
}
