package com.bookinghomestay.app.application.homestay.query;

import java.time.LocalDate;
import java.util.List;

import lombok.*;

@AllArgsConstructor
@Getter
public class GetSearchHomestayQuery {
    private String locationId;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private List<String> amenitiesId;
    private int minPrice;
    private int maxPrice;
    private int page;
    private int limit;
}
