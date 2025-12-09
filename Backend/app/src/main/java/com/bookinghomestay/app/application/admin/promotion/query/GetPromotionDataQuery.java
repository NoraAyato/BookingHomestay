package com.bookinghomestay.app.application.admin.promotion.query;

import java.time.LocalDate;

import org.springframework.cglib.core.Local;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetPromotionDataQuery {
    private LocalDate startDate;
    private LocalDate endDate;
    private String search;
    private String status;
    private int page;
    private int size;
}
