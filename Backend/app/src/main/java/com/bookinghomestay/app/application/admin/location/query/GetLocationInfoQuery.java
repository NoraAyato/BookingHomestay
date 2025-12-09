package com.bookinghomestay.app.application.admin.location.query;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetLocationInfoQuery {
    private String search;
    private int page;
    private int size;
}
