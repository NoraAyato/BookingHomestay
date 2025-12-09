package com.bookinghomestay.app.application.admin.topic.query;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetTopicDataQuery {
    private String search;
    private int page;
    private int size;
    private String status;
}
