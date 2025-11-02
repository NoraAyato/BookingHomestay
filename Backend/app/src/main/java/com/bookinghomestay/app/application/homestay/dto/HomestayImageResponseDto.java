package com.bookinghomestay.app.application.homestay.dto;

import lombok.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HomestayImageResponseDto {
    private String homestayId;
    private String mainImage;
    private List<String> roomImages;
}
