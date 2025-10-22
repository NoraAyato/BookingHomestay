package com.bookinghomestay.app.api.controller.amenities;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.api.dto.amenities.AmenitiesResponseDto;
import com.bookinghomestay.app.api.dto.common.ApiResponse;
import com.bookinghomestay.app.api.dto.homestay.HomestayResponseDto;
import com.bookinghomestay.app.application.amenities.query.QueryAllAmenitiesHandler;

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
