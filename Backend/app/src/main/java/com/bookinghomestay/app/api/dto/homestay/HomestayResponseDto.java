package com.bookinghomestay.app.api.dto.homestay;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HomestayResponseDto {
    private String id;
    private String tenHomestay;
    private String hinhAnh;
    private BigDecimal pricePerNight;
    private String diaChi;
    private BigDecimal hang;
}
