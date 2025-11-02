package com.bookinghomestay.app.application.promotion.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AvailablePromotionResponseDto {
    private String id;
    private String title;
    private String description;
    private String discountType;
    private Double discountValue;
    private String code;
    private String image;
    private BigDecimal minSpend;
    private String expiryDate;
}
