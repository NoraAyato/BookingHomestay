package com.bookinghomestay.app.application.host.promotion.query;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class HostGetPromotionQuery {
    private String search;
    private int page;
    private int size;
    private String status;
    private String type;
    private LocalDate startDate;
    private LocalDate endDate;
    private String hostId;
}
