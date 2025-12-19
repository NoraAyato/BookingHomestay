package com.bookinghomestay.app.application.host.promotion.dto;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HostPromotionUpdateRequestDto {
    private String description;
    private String discountType;
    private Integer discountValue;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    private Integer minBookedDays;
    private Integer minNights;
    private Integer minValue;
    private Integer quantity;
    private String status;
    private Boolean isForNewCustomer;
}
