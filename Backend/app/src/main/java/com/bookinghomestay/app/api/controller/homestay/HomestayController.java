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
import com.bookinghomestay.app.api.dto.ApiResponse;
import com.bookinghomestay.app.api.dto.homestay.*;
import com.bookinghomestay.app.application.danhgia.query.GetHomestayReviewsQuery;
import com.bookinghomestay.app.application.danhgia.query.GetHomestayReviewsQueryHandler;
import com.bookinghomestay.app.application.homestay.query.GetAllHomestayQueryHandler;
import com.bookinghomestay.app.application.homestay.query.GetHomestayDetailQuery;
import com.bookinghomestay.app.application.homestay.query.GetHomestayDetailQueryHandler;
import com.bookinghomestay.app.application.homestay.query.GetHomestayDichVuQuery;
import com.bookinghomestay.app.application.homestay.query.GetHomestayDichVuQueryHandler;
import com.bookinghomestay.app.application.homestay.query.GetHomestayImagesQuery;
import com.bookinghomestay.app.application.homestay.query.GetHomestayImagesQueryHandler;
import com.bookinghomestay.app.application.homestay.query.GetHomestayTienNghiQuery;
import com.bookinghomestay.app.application.homestay.query.GetHomestayTienNghiQueryHandler;
import com.bookinghomestay.app.application.homestay.query.GetRoomAvailabilityQueryHandler;
import com.bookinghomestay.app.application.homestay.query.GetRoomImagesQueryHandler;
import com.bookinghomestay.app.application.homestay.query.GetTopHomestayQueryHandler;

import lombok.RequiredArgsConstructor;
import com.bookinghomestay.app.application.homestay.query.GetRoomDetailQueryHandler;

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
    private final GetRoomDetailQueryHandler getRoomDetailQueryHandler;
    private final GetHomestayDichVuQueryHandler getHomestayDichVuQueryHandler;

    @GetMapping
    public ResponseEntity<ApiResponse<List<HomestayResponseDto>>> getAll() {
        List<HomestayResponseDto> homestays = getAllHandler.handle();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách homestay thành công", homestays));
    }

    @GetMapping("/top")
    public ResponseEntity<ApiResponse<List<HomestayTop5ResponeDto>>> getTopRated() {
        List<HomestayTop5ResponeDto> topHomestays = getTopHandler.handle();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách top homestay thành công", topHomestays));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HomestayDetailResponseDto>> getDetail(@PathVariable String id) {
        HomestayDetailResponseDto detail = getHomestayDetailQueryHandler.handle(new GetHomestayDetailQuery(id));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy chi tiết homestay thành công", detail));
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<ApiResponse<HomestayImageResponseDto>> getHomestayImages(@PathVariable String id) {
        HomestayImageResponseDto dto = getHomestayImagesQueryHandler.handle(new GetHomestayImagesQuery(id));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy hình ảnh homestay thành công", dto));
    }

    @GetMapping("/{homestayId}/tiennghi")
    public ResponseEntity<ApiResponse<HomestayTienNghiResponseDto>> getTienNghiByHomestay(
            @PathVariable String homestayId) {
        HomestayTienNghiResponseDto dto = getHomestayTienNghiQueryHandler
                .handle(new GetHomestayTienNghiQuery(homestayId));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy tiện nghi homestay thành công", dto));
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<ApiResponse<List<HomestayReviewResponseDto>>> getReviews(
            @PathVariable String id,
            @RequestParam(required = false) String haiLongRange,
            @RequestParam(required = false) String reviewerType, // "me" or "others"
            @RequestParam(required = false) String currentUserId) {
        GetHomestayReviewsQuery query = new GetHomestayReviewsQuery(id, haiLongRange, reviewerType, currentUserId);
        List<HomestayReviewResponseDto> reviews = getHomestayReviewsQueryHandler.handle(query);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy đánh giá homestay thành công", reviews));
    }

    @GetMapping("/{homestayId}/available-rooms")
    public ResponseEntity<ApiResponse<List<RoomAvailabilityDto>>> getAvailableRooms(
            @PathVariable String homestayId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime ngayDen,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime ngayDi) {
        List<RoomAvailabilityDto> rooms = getRoomAvailabilityQueryHandler.handle(homestayId, ngayDen, ngayDi);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách phòng khả dụng thành công", rooms));
    }

    @GetMapping("/rooms/{maPhong}/images")
    public ResponseEntity<ApiResponse<RoomImagesDto>> getRoomImages(@PathVariable String maPhong) {
        RoomImagesDto dto = getRoomImagesQueryHandler.handle(maPhong);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy hình ảnh phòng thành công", dto));
    }

    @GetMapping("/rooms/{maPhong}/detail")
    public ResponseEntity<ApiResponse<RoomDetailResponseDTO>> getRoomDetail(@PathVariable String maPhong) {
        RoomDetailResponseDTO dto = getRoomDetailQueryHandler.handle(maPhong);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy chi tiết phòng thành công", dto));
    }

    @GetMapping("/{homestayId}/dichvu")
    public ResponseEntity<ApiResponse<HomestayDichVuResponseDto>> getDichVuByHomestay(@PathVariable String homestayId) {
        HomestayDichVuResponseDto dto = getHomestayDichVuQueryHandler.handle(new GetHomestayDichVuQuery(homestayId));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy dịch vụ homestay thành công", dto));
    }

}
