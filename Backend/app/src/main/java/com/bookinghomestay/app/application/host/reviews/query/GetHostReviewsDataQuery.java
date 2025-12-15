package com.bookinghomestay.app.application.host.reviews.query;

import java.time.LocalDate;

import org.hibernate.validator.constraints.pl.NIP;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetHostReviewsDataQuery {
    private int page;
    private int size;
    private Integer rating;
    private String search;
    private String homestayId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String userId;
}
