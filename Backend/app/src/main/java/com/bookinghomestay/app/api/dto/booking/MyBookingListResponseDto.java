package com.bookinghomestay.app.api.dto.booking;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class MyBookingListResponseDto {
    private String id;
    private String bookingDate;
    private BigDecimal totalPrice;
    private String status;
    private List<Room> rooms;

    @Getter
    @Setter
    public static class Room {
        private String id;
        private String homestay;
        private String location;
        private String checkIn;
        private String checkOut;
        private BigDecimal price;
        private String image;
        private String roomType;
        private List<Service> services;

        @Getter
        @Setter
        public static class Service {
            private String id;
            private String name;
            private BigDecimal price;
        }
    }
}