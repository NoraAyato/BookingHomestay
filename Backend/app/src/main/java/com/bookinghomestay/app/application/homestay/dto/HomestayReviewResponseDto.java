// HomestayReviewResponseDto.java
package com.bookinghomestay.app.application.homestay.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HomestayReviewResponseDto {
    private String id;
    private String username;
    private String userAvatar;
    private String rating;
    private String comment;
    private String image;
    private LocalDateTime date;
}
