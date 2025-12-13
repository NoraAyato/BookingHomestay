package com.bookinghomestay.app.application.host.room.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RoomTypeDataResponse {
    private String id;
    private String name;
    private String description;
}
