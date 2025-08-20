package com.bookinghomestay.app.api.controller.region;

import com.bookinghomestay.app.api.dto.KhuVuc.KhuVucResponseDto;
import com.bookinghomestay.app.application.khuvuc.query.GetAllKhuVucQueryHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class RegionController {

    private final GetAllKhuVucQueryHandler getAllKhuVucQueryHandler;

    @GetMapping
    public List<KhuVucResponseDto> getAllKhuVuc() {
        return getAllKhuVucQueryHandler.handle();
    }
}