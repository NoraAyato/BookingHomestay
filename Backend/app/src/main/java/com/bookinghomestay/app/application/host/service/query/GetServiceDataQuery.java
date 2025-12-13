package com.bookinghomestay.app.application.host.service.query;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetServiceDataQuery {
    private String search;
    private String homestayId;
    private int page;
    private int size;
    private String userId;
}
