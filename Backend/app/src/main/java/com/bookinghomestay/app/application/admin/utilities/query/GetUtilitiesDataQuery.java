package com.bookinghomestay.app.application.admin.utilities.query;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class GetUtilitiesDataQuery {
    private int page;
    private int size;
    private String search;
}
