package com.bookinghomestay.app.application.news.query;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAllNewsQuery {
    private int page;
    private int size;
    private String topic;
}
