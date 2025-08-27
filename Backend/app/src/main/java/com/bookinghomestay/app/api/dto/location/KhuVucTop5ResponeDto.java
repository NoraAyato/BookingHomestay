package com.bookinghomestay.app.api.dto.location;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class KhuVucTop5ResponeDto {
    private String id;
    private String name;
    private String description;
    private String image;
    private int count;
}
