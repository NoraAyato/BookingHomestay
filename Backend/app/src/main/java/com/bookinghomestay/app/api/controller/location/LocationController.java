package com.bookinghomestay.app.api.controller.location;

import com.bookinghomestay.app.api.dto.common.ApiResponse;
import com.bookinghomestay.app.api.dto.location.KhuVucResponseDto;
import com.bookinghomestay.app.api.dto.location.KhuVucTop5ResponeDto;
import com.bookinghomestay.app.application.location.query.GetAllKhuVucQueryHandler;
import com.bookinghomestay.app.application.location.query.GetAllTop5KhuVucQueryHandler;

import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final GetAllKhuVucQueryHandler getAllKhuVucQueryHandler;
    private final GetAllTop5KhuVucQueryHandler getAllTop5KhuVucQueryHandler;

    @GetMapping
    public ResponseEntity<ApiResponse<List<KhuVucResponseDto>>> getAllKhuVuc() {
        List<KhuVucResponseDto> result = getAllKhuVucQueryHandler.handle();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách khu vực thành công", result));
    }

    @GetMapping("/top")
    public ResponseEntity<ApiResponse<List<KhuVucTop5ResponeDto>>> getTop5KhuVuc() {
        List<KhuVucTop5ResponeDto> result = getAllTop5KhuVucQueryHandler.handle();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách 5 khu vực hàng đầu thành công", result));
    }

}