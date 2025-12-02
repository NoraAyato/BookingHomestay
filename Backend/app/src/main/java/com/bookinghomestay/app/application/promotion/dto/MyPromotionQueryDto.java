package com.bookinghomestay.app.application.promotion.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyPromotionQueryDto {
    private String userId;
    private int page;
    private int limit;
}
