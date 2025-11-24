package com.bookinghomestay.app.api.controller;

import com.bookinghomestay.app.application.location.dto.LocationResponseDto;
import com.bookinghomestay.app.application.location.dto.LocationSuggestResultDto;
import com.bookinghomestay.app.application.location.dto.LocationTop5ResponeDto;
import com.bookinghomestay.app.application.location.query.GetAllLocationsQueryHandler;
import com.bookinghomestay.app.application.location.query.GetAllTop5LocationsQueryHandler;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.domain.repository.ISearchHomestayRepository;
import com.bookinghomestay.app.domain.repository.ISearchLocationRepository;
import com.bookinghomestay.app.infrastructure.elasticsearch.document.LocationSearchDocument;

import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final GetAllLocationsQueryHandler getAllKhuVucQueryHandler;
    private final GetAllTop5LocationsQueryHandler getAllTop5KhuVucQueryHandler;
    private final ISearchLocationRepository searchRepo;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LocationResponseDto>>> getAllKhuVuc() {
        List<LocationResponseDto> result = getAllKhuVucQueryHandler.handle();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách khu vực thành công", result));
    }

    @GetMapping("/top")
    public ResponseEntity<ApiResponse<List<LocationTop5ResponeDto>>> getTop5KhuVuc() {
        List<LocationTop5ResponeDto> result = getAllTop5KhuVucQueryHandler.handle();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách 5 khu vực hàng đầu thành công", result));
    }

    @GetMapping("/search/suggest")
    public ResponseEntity<ApiResponse<List<LocationSuggestResultDto>>> suggest(@RequestParam String prefix) {
        List<LocationSuggestResultDto> result = searchRepo.suggestKeyword(prefix);
        return ResponseEntity.ok(new ApiResponse<>(true, "Gợi ý tìm kiếm khu vực thành công", result));
    }

    @GetMapping("/search/keyword")
    public ResponseEntity<ApiResponse<List<LocationSearchDocument>>> search(@RequestParam String keyword) {
        List<LocationSearchDocument> result = searchRepo.searchByKeyword(keyword);
        return ResponseEntity.ok(new ApiResponse<>(true, "Tìm kiếm khu vực thành công", result));
    }
}