package com.bookinghomestay.app.application.booking.dto.booking;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class BookingResponseDto {
    private String bookingId;
    private String homestayName;
    private String invId;
    private BigDecimal totalPrice;
    private String status;
    private List<Room> rooms;
    private String checkIn;
    private String checkOut;
    private String location;
    private BigDecimal haveToPayPrice;
    private String promotionId;
    private boolean isCancelable;
    @Getter
    @Setter
    public static class Room {
        private BigDecimal price;
        private String image;
        private String roomType;
        private List<Service> services;

        @Getter
        @Setter
        public static class Service {
            private String name;
            private BigDecimal price;
        }
    }
}