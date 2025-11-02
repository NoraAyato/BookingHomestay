package com.bookinghomestay.app.application.booking.command;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BookingAddPromotionCommand {
    private String bookingId;
    private String promotionCode;
    private String userId;
}
