package com.bookinghomestay.app.api.controller.host;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.bookinghomestay.app.application.host.room.command.HostCreateRoomCommandHandler;
import com.bookinghomestay.app.application.host.room.command.HostDeleteRoomCommandHandler;
import com.bookinghomestay.app.application.host.room.command.HostUpdateRoomCommandHandler;
import com.bookinghomestay.app.application.host.room.dto.HostRoomCreateRequestDto;
import com.bookinghomestay.app.application.host.room.dto.HostRoomDataResponseDto;
import com.bookinghomestay.app.application.host.room.dto.RoomTypeDataResponse;
import com.bookinghomestay.app.application.host.room.dto.RoomUpdateRequestDto;
import com.bookinghomestay.app.application.host.room.query.GetHostRoomDataQuery;
import com.bookinghomestay.app.application.host.room.query.GetHostRoomDataQueryHandler;
import com.bookinghomestay.app.application.host.room.query.GetRoomTypeListQueryHandler;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/host/room")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('Admin') or hasRole('Host')")
public class HostRoomController {
    private final GetHostRoomDataQueryHandler getHostRoomDataQueryHandler;
    private final GetRoomTypeListQueryHandler getRoomTypeListQueryHandler;
    private final HostUpdateRoomCommandHandler hostUpdateRoomCommandHandler;
    private final HostDeleteRoomCommandHandler hostDeleteRoomCommandHandler;
    private final HostCreateRoomCommandHandler hostCreateRoomCommandHandler;

    @GetMapping()
    public ResponseEntity<ApiResponse<PageResponse<HostRoomDataResponseDto>>> getRoomsData(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String homestayId,
            @RequestParam(required = false) String roomTypeId) {
        String userId = SecurityUtils.getCurrentUserId();
        var result = getHostRoomDataQueryHandler.handle(new GetHostRoomDataQuery(
                search, page, size, status, homestayId, roomTypeId, userId));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin phòng thành công !", result));
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Void>> addRoom(
            @RequestPart("room") HostRoomCreateRequestDto requestDto,
            @RequestPart("amenitiesIds") List<String> amenitiesIds,
            @RequestPart("images") List<MultipartFile> images) {
        hostCreateRoomCommandHandler.handle(requestDto, amenitiesIds, images);
        return ResponseEntity.ok(new ApiResponse<>(true, "Thêm phòng thành công !", null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> updateRoom(@PathVariable String id,
            @RequestPart("room") RoomUpdateRequestDto requestDto,
            @RequestPart(value = "amenitiesIds", required = false) List<String> amenitiesIds,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        String userId = SecurityUtils.getCurrentUserId();
        hostUpdateRoomCommandHandler.handle(id, requestDto, amenitiesIds, images, userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật dữ liệu phòng thành công !", null));
    }

    @GetMapping("/roomType-List")
    public ResponseEntity<ApiResponse<List<RoomTypeDataResponse>>> getRoomTypeList() {
        var result = getRoomTypeListQueryHandler.handler();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách loại phòng thành công !", result));
    }

    @PostMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoom(@PathVariable String id) {
        String userId = SecurityUtils.getCurrentUserId();
        hostDeleteRoomCommandHandler.handle(id, userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Xóa phòng thành công !", null));
    }

}
