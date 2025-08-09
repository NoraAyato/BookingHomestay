package com.bookinghomestay.app.application.promotion.query;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GetMyPromotionQuery {
    private String maPhong;
    private LocalDate ngayDen;
    private LocalDate ngayDi;
    private String userId;
}
