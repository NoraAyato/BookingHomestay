package com.bookinghomestay.app.application.booking.command;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ConfirmBookingCommand {
    private final String userId;
    private final String maPDPhong;
    private final List<String> serviceIds;
    private final String promotionId;

}
