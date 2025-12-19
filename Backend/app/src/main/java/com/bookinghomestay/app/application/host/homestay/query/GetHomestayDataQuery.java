package com.bookinghomestay.app.application.host.homestay.query;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetHomestayDataQuery {
    private String search;
    private int page;
    private int size;
    private String locationId;
    private String status;
    private String sortBy;
    private String hostId;
}
