package com.bookinghomestay.app.application.host.promotion.command;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HostUpdatePromotionCommand {
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
    private List<String> homestayIds;
    private String hostId;
}
