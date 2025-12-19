package com.bookinghomestay.app.application.host.bookings.query;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HostBookingDataQuery {
    private String hostId;
    private String search;
    private int page;
    private int size;
    private String status;
    private LocalDate fromDate;
    private LocalDate toDate;
}
