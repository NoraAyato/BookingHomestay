package com.bookinghomestay.app.application.admin.room.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UpdateRoomTypeRequest {
    private String newName;
    private String newDescription;
}
