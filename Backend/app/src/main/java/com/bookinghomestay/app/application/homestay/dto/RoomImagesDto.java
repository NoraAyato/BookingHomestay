package com.bookinghomestay.app.application.homestay.dto;

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