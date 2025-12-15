package com.bookinghomestay.app.application.host.promotion.dto;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HostCreatePromotionRequestDto {

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
