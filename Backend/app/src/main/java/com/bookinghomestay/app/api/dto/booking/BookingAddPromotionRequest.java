package com.bookinghomestay.app.api.dto.booking;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingAddPromotionRequest {

    @NotBlank
    private String promotionCode;
}
