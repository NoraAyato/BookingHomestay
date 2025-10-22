package com.bookinghomestay.app.api.dto.homestay;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HomestayDichVuResponseDto {
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private String image;
}
