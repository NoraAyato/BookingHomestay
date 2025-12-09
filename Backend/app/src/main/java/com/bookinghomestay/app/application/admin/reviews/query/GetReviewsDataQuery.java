package com.bookinghomestay.app.application.admin.reviews.query;

import java.time.LocalDate;

import org.hibernate.validator.constraints.pl.NIP;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetReviewsDataQuery {
    private int page;
    private int size;
    private Integer rating;
    private String search;
    private LocalDate startDate;
    private LocalDate endDate;
}
