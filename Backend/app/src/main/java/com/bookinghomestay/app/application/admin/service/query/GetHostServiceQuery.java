package com.bookinghomestay.app.application.admin.service.query;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class GetHostServiceQuery {
    private String search;
    private int page;
    private int size;
    private String status;
}
