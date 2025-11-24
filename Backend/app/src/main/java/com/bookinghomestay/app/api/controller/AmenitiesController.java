package com.bookinghomestay.app.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.application.amenities.dto.amenities.AmenitiesResponseDto;
import com.bookinghomestay.app.application.amenities.query.QueryAllAmenitiesHandler;
import com.bookinghomestay.app.application.homestay.dto.HomestayResponseDto;
import com.bookinghomestay.app.common.response.ApiResponse;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/amenities")
@RequiredArgsConstructor
public class AmenitiesController {
    private final QueryAllAmenitiesHandler queryAllAmenitiesHandler;

    @GetMapping()
    public ResponseEntity<ApiResponse<List<AmenitiesResponseDto>>> getAll() {
        List<AmenitiesResponseDto> amenities = queryAllAmenitiesHandler.handle();
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Lấy danh sách tiện nghi thành công", amenities));
    }

}
