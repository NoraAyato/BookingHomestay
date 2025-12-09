package com.bookinghomestay.app.application.admin.promotion.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreatePromotionRequestDto {
    private String description;
    private String discountType;
    private String discountValue;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    private String minBookedDays;
    private String minNights;
    private String minValue;
    private String quantity;
    private String status;
    private String isForNewCustomer;
}
