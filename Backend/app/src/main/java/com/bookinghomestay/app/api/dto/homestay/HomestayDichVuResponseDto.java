package com.bookinghomestay.app.api.dto.homestay;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HomestayDichVuResponseDto {
    private String homestayId;
    private List<DichVuDto> dichVus;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DichVuDto {
        private String maDV;
        private String tenDV;
        private BigDecimal donGia;
        private String hinhAnh;
    }
}
