package com.bookinghomestay.app.application.admin.room.query;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetRoomTypeDataQuery {
    private String search;
    private int page;
    private int size;
}
