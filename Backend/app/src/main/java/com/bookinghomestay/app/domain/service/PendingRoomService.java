package com.bookinghomestay.app.domain.service;

import java.time.LocalDate;

public interface PendingRoomService {
    boolean holdRoom(String roomId, LocalDate ngayDen, LocalDate ngayDi, String userId, long expirationMinutes);

    boolean isRoomAvailable(String roomId, LocalDate ngayDen, LocalDate ngayDi);

    void releaseRoom(String roomId, LocalDate ngayDen, LocalDate ngayDi);

    boolean isRoomHeldByUser(String roomId, LocalDate ngayDen, LocalDate ngayDi, String userId);
}
