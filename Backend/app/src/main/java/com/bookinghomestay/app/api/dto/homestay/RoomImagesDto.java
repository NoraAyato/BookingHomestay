package com.bookinghomestay.app.api.dto.homestay;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomImagesDto {
    private String maPhong;
    private List<String> urlAnhs;
}