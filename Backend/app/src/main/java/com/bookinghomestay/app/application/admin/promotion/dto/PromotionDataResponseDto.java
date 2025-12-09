package com.bookinghomestay.app.application.admin.promotion.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PromotionDataResponseDto {
    private String id;
    private String image;
    private int bookedTimes;
    private int minNights;
    private String title;
    private String type;
    private double value;
    private String description;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal usageLimit;
    private int usageCount;
    private double minBookingValue;
    private String createdBy;
    private LocalDate createdDate;
    private boolean isForNewCustomer;
}
