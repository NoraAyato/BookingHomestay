package com.bookinghomestay.app.application.admin.promotion.command;

import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdatePromotionCommand {
    private String promotionId;
    private String description;
    private MultipartFile image;
    private String discountType;
    private int discountValue;
    private LocalDate startDate;
    private LocalDate endDate;
    private int minBookedDays;
    private int minNights;
    private int minValue;
    private int quantity;
    private String status;
    private Boolean isForNewCustomer;
}
