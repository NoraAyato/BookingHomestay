package com.bookinghomestay.app.api.controller.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.application.admin.homestay.command.AddHomestayCommandHandler;
import com.bookinghomestay.app.application.admin.homestay.command.DeleteHomestayCommandHandler;
import com.bookinghomestay.app.application.admin.homestay.command.UpdateHomestayInfoCommand;
import com.bookinghomestay.app.application.admin.homestay.command.UpdateHomestayInfoCommandHanler;
import com.bookinghomestay.app.application.admin.homestay.dto.AddHomestayRequestDto;
import com.bookinghomestay.app.application.admin.homestay.dto.HomestayInfoResponseDto;
import com.bookinghomestay.app.application.admin.homestay.dto.UpdateHomestayRequestDto;
import com.bookinghomestay.app.application.admin.homestay.query.HomestayInfoQuery;
import com.bookinghomestay.app.application.admin.homestay.query.HomestayInfoQueryHandler;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.common.response.PageResponse;

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
@RequestMapping("/api/admin/homestaymanager")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('Admin')")
public class HomestayManagerController {
    private final HomestayInfoQueryHandler homestayInfoQueryHandler;
    private final UpdateHomestayInfoCommandHanler updateHomestayInfoCommandHanler;
    private final AddHomestayCommandHandler addHomestayCommandHandler;
    private final DeleteHomestayCommandHandler deleteHomestayCommandHandler;

    @GetMapping()
    public ResponseEntity<ApiResponse<PageResponse<HomestayInfoResponseDto>>> getHomestay(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int limit,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer minRoom,
            @RequestParam(required = false) String locationId,
            @RequestParam(required = false) Double rating,
            @RequestParam(required = false) Integer revenue) {
        PageResponse<HomestayInfoResponseDto> response = homestayInfoQueryHandler.handle(
                new HomestayInfoQuery(
                        search, locationId, status, page, limit, minPrice, minRoom, rating, revenue));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin homestay thành công !", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> putMethodName(@PathVariable String id,
            @ModelAttribute UpdateHomestayRequestDto requestDto) {
        updateHomestayInfoCommandHanler.handler(new UpdateHomestayInfoCommand(id, requestDto.getHomestayName(),
                requestDto.getDescription(), requestDto.getIdHost(), requestDto.getAddress(),
                requestDto.getLocationId(), requestDto.getStatus(), requestDto.getImage()));
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật homestay thành công !", null));
    }

    @PostMapping()
    public ResponseEntity<ApiResponse<Void>> addHomestay(@ModelAttribute AddHomestayRequestDto requestDto) {
        addHomestayCommandHandler.handle(requestDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Thêm homestay thành công !", null));
    }

    @PutMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHomstay(@PathVariable String id) {
        deleteHomestayCommandHandler.handle(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Xóa homestay thành công !", null));
    }

}
