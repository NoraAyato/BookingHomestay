package com.bookinghomestay.app.application.host.room.query;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetHostRoomDataQuery {
    private String search;
    private int page;
    private int size;
    private String status;
    private String homestayId;
    private String roomTypeId;
    private String userId;
}
