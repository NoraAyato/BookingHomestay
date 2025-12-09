package com.bookinghomestay.app.application.admin.room.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomTypeDataResponseDto {
    private String id;
    private String name;
    private String description;
}
