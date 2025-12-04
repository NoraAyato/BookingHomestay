package com.bookinghomestay.app.application.admin.homestay.query;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HomestayInfoQuery {
    private String search;
    private String locationId;
    private String status;
    private int page;
    private int size;
    private Integer minPrice;
    private Integer minRoom;
    private Double rating;
    private Integer revenue;

}
