package com.bookinghomestay.app.api.dto.promotion;

import java.time.LocalDate;

import lombok.Data;

@Data
public class GetMyPromotionRequestDto {
    private String maPhong;
    private LocalDate ngayDen;
    private LocalDate ngayDi;
}
