package com.bookinghomestay.app.application.booking.dto.booking;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingAddPromotionRequest {

    @NotBlank
    private String promotionCode;
}
