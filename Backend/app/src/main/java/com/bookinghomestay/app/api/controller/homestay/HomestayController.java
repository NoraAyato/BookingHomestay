package com.bookinghomestay.app.api.controller.homestay;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.bookinghomestay.app.api.dto.homestay.*;
import com.bookinghomestay.app.application.danhgia.query.GetHomestayReviewsQuery;
import com.bookinghomestay.app.application.danhgia.query.GetHomestayReviewsQueryHandler;
import com.bookinghomestay.app.application.homestay.query.GetAllHomestayQueryHandler;
import com.bookinghomestay.app.application.homestay.query.GetHomestayDetailQuery;
import com.bookinghomestay.app.application.homestay.query.GetHomestayDetailQueryHandler;
import com.bookinghomestay.app.application.homestay.query.GetHomestayImagesQuery;
import com.bookinghomestay.app.application.homestay.query.GetHomestayImagesQueryHandler;
import com.bookinghomestay.app.application.homestay.query.GetHomestayTienNghiQuery;
import com.bookinghomestay.app.application.homestay.query.GetHomestayTienNghiQueryHandler;
import com.bookinghomestay.app.application.homestay.query.GetRoomAvailabilityQueryHandler;
import com.bookinghomestay.app.application.homestay.query.GetRoomImagesQueryHandler;
import com.bookinghomestay.app.application.homestay.query.GetTopHomestayQueryHandler;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/homestays")
@RequiredArgsConstructor
public class HomestayController {

    private final GetAllHomestayQueryHandler getAllHandler;
    private final GetTopHomestayQueryHandler getTopHandler;
    private final GetHomestayDetailQueryHandler getHomestayDetailQueryHandler;
    private final GetHomestayImagesQueryHandler getHomestayImagesQueryHandler;
    private final GetHomestayTienNghiQueryHandler getHomestayTienNghiQueryHandler;
    private final GetHomestayReviewsQueryHandler getHomestayReviewsQueryHandler;
    private final GetRoomAvailabilityQueryHandler getRoomAvailabilityQueryHandler;
    private final GetRoomImagesQueryHandler getRoomImagesQueryHandler;

    @GetMapping
    public List<HomestayResponseDto> getAll() {
        return getAllHandler.handle();
    }

    @GetMapping("/top")
    public List<HomestayResponseDto> getTopRated() {
        return getTopHandler.handle();
    }

    @GetMapping("/{id}")
    public HomestayDetailResponseDto getDetail(@PathVariable String id) {
        return getHomestayDetailQueryHandler.handle(new GetHomestayDetailQuery(id));
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<HomestayImageResponseDto> getHomestayImages(@PathVariable String id) {
        HomestayImageResponseDto dto = getHomestayImagesQueryHandler.handle(new GetHomestayImagesQuery(id));
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{homestayId}/tiennghi")
    public ResponseEntity<HomestayTienNghiResponseDto> getTienNghiByHomestay(@PathVariable String homestayId) {
        var dto = getHomestayTienNghiQueryHandler.handle(new GetHomestayTienNghiQuery(homestayId));
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<HomestayReviewResponseDto>> getReviews(
            @PathVariable String id,
            @RequestParam(required = false) String haiLongRange,
            @RequestParam(required = false) String reviewerType, // "me" or "others"
            @RequestParam(required = false) String currentUserId) {
        var query = new GetHomestayReviewsQuery(id, haiLongRange, reviewerType, currentUserId);
        var reviews = getHomestayReviewsQueryHandler.handle(query);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{homestayId}/available-rooms")
    public ResponseEntity<List<RoomAvailabilityDto>> getAvailableRooms(
            @PathVariable String homestayId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime ngayDen,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime ngayDi) {
        List<RoomAvailabilityDto> rooms = getRoomAvailabilityQueryHandler.handle(homestayId, ngayDen, ngayDi);
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/rooms/{maPhong}/images")
    public ResponseEntity<RoomImagesDto> getRoomImages(@PathVariable String maPhong) {
        RoomImagesDto dto = getRoomImagesQueryHandler.handle(maPhong);
        return ResponseEntity.ok(dto);
    }
}
