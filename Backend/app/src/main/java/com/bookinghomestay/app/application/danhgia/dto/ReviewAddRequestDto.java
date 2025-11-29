package com.bookinghomestay.app.application.danhgia.dto;

import org.springframework.lang.Nullable;
import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;

@Data
@AllArgsConstructor
@ToString
public class ReviewAddRequestDto {
    private String bookingId;
    private String homestayId;  
    private int cleanlinessRating;
    private int serviceRating;
    private int utilitiesRating;
    @Nullable
    private MultipartFile image;
    private String comment;
}
