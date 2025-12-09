package com.bookinghomestay.app.application.admin.promotion.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PromotionStatsResponseDto {
    private int total;
    private int active;
    private int totalUsage;
    private int inactive;
}
