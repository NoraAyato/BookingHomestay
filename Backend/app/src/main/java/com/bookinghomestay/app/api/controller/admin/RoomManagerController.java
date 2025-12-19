package com.bookinghomestay.app.api.controller.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.application.admin.room.command.CreateRoomTypeCommandHandler;
import com.bookinghomestay.app.application.admin.room.command.DeleteRoomTypeCommandHandler;
import com.bookinghomestay.app.application.admin.room.command.UpdateRoomTypeCommandHandler;
import com.bookinghomestay.app.application.admin.room.dto.CreateRoomTypeRequestDto;
import com.bookinghomestay.app.application.admin.room.dto.RoomTypeDataResponseDto;
import com.bookinghomestay.app.application.admin.room.dto.UpdateRoomTypeRequest;
import com.bookinghomestay.app.application.admin.room.query.GetRoomTypeDataQuery;
import com.bookinghomestay.app.application.admin.room.query.GetRoomTypeDataQueryHandler;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.common.response.PageResponse;

import co.elastic.clients.elasticsearch.ml.Page;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/admin/roomsmanager")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('Admin')")
public class RoomManagerController {
    private final GetRoomTypeDataQueryHandler getRoomTypeDataQueryHandler;
    private final UpdateRoomTypeCommandHandler updateRoomTypeCommandHandler;
    private final DeleteRoomTypeCommandHandler deleteRoomTypeCommandHandler;
    private final CreateRoomTypeCommandHandler createRoomTypeCommandHandler;

    @GetMapping("/roomType")
    public ResponseEntity<ApiResponse<PageResponse<RoomTypeDataResponseDto>>> getRoomTypeData(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int limit) {
        PageResponse<RoomTypeDataResponseDto> response = getRoomTypeDataQueryHandler
                .handle(new GetRoomTypeDataQuery(search, page, limit));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin loại phòng thành công !", response));
    }

    @PostMapping("/roomType/create")
    public ResponseEntity<ApiResponse<Void>> createRoomType(@RequestBody CreateRoomTypeRequestDto requestDto) {
        createRoomTypeCommandHandler.handle(requestDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Tạo loại phòng thành công!", null));
    }

    @PutMapping("/roomType/{id}")
    public ResponseEntity<ApiResponse<Void>> updateRoomType(@PathVariable String id,
            @ModelAttribute UpdateRoomTypeRequest requestDto) {
        System.out.println("log" + id + " " + requestDto.toString());
        updateRoomTypeCommandHandler.handle(id, requestDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật loại phòng thành công !", null));
    }

    @PostMapping("/roomType/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoomType(@PathVariable String id) {
        deleteRoomTypeCommandHandler.handle(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Xóa loại phòng thành công!", null));
    }

}
