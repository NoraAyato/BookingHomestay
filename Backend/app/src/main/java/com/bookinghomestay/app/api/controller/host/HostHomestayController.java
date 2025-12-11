package com.bookinghomestay.app.api.controller.host;

import com.bookinghomestay.app.application.admin.homestay.command.DeleteHomestayCommandHandler;
import com.bookinghomestay.app.application.host.homestay.command.UpdateHomestayCommandHandler;
import com.bookinghomestay.app.application.host.homestay.dto.HostHomestayDataResponseDto;
import com.bookinghomestay.app.application.host.homestay.dto.HostHomestayUpdateRequestDto;
import com.bookinghomestay.app.application.host.homestay.query.GetHomestayDataQuery;
import com.bookinghomestay.app.application.host.homestay.query.GetHomestayDataQueryHandler;
import com.bookinghomestay.app.application.host.homestay.query.GetHostHomestayStatsQueryHandler;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.apache.catalina.security.SecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/host/homestay")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('Admin') or hasRole('Host')")
public class HostHomestayController {
    private final GetHomestayDataQueryHandler getHomestayDataQueryHandler;
    private final DeleteHomestayCommandHandler deleteHomestayCommandHandler;
    private final UpdateHomestayCommandHandler updateHomestayCommandHandler;
    private final GetHostHomestayStatsQueryHandler getHostHomestayStatsQueryHandler;

    @GetMapping()
    public ResponseEntity<ApiResponse<PageResponse<HostHomestayDataResponseDto>>> getHomestayData(
            @RequestParam(required = false) String search, @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "4") int size,
            @RequestParam(required = false) String locationId, @RequestParam(required = false) String status,
            @RequestParam(required = false) String sortBy) {
        String userId = SecurityUtils.getCurrentUserId();
        PageResponse<HostHomestayDataResponseDto> response = getHomestayDataQueryHandler.handle(
                new GetHomestayDataQuery(search, page, size, locationId, status, sortBy, userId));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin homestay thành công !", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> updateHomestay(@PathVariable String id,
            @ModelAttribute HostHomestayUpdateRequestDto req) {
        updateHomestayCommandHandler.handle(id, req);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật dữ liệu homestay thành công !", null));
    }

    @PostMapping("/{id}/delete")
    public ResponseEntity<ApiResponse<Void>> deleteHomestay(@PathVariable String id) {
        deleteHomestayCommandHandler.handle(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Dừng hoạt động homestay thành công !", null));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<?>> getHostHomestayStats() {
        String hostId = SecurityUtils.getCurrentUserId();
        var stats = getHostHomestayStatsQueryHandler.handle(hostId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thống kê homestay thành công!", stats));
    }
}