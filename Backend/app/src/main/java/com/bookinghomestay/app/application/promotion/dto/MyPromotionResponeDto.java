package com.bookinghomestay.app.application.promotion.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyPromotionResponeDto {
    private String id;
    private String title;
    private String description;
    private String expiry;
    private String image;
}
