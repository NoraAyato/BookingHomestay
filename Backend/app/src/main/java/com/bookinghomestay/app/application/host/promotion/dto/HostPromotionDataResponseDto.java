package com.bookinghomestay.app.application.host.promotion.dto;

import java.time.LocalDate;
import java.util.List;

import com.bookinghomestay.app.application.host.homestay.dto.HostHomestayList;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class HostPromotionDataResponseDto {
    private String id;
    private String code;
    private String title;
    private String type;
    private String description;
    private int value;
    private int usageLimit;
    private int usageCount;
    private int minBookingAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private int bookedTimes;
    private int minNights;
    private String createdBy;
    private LocalDate createdDate;
    private boolean isForNewCustomer;
    private String image;
    private List<HostHomestayList> homestays;
}
