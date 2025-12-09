package com.bookinghomestay.app.application.admin.booking.query;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class GetBookingDataQuery {
    private int page;
    private int size;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private String keyword;
}
