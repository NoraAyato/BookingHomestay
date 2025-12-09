package com.bookinghomestay.app.application.admin.news.query;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class GetNewsDataQuery {
    private String search;
    private int page;
    private int size;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String category;
}
