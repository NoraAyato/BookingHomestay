package com.bookinghomestay.app.application.host.room.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class HostRoomCreateRequestDto {
    private String name;
    private String roomTypeId;
    private int capacity;
    private String status;
    private int price;
    private String homestayId;
}
