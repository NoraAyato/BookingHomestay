package com.bookinghomestay.app.api.dto.homestay;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SuggestResultDto {
    private String tenHomestay;
    private String diaChi;
    private String khuVuc;
}
