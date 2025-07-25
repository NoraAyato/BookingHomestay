package com.bookinghomestay.app.api.controller.homestay;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bookinghomestay.app.api.dto.homestay.*;
import com.bookinghomestay.app.application.homestay.query.GetAllHomestayQueryHandler;
import com.bookinghomestay.app.application.homestay.query.GetTopHomestayQueryHandler;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/homestays")
@RequiredArgsConstructor
public class HomestayController {

    private final GetAllHomestayQueryHandler getAllHandler;
    private final GetTopHomestayQueryHandler getTopHandler;

    @GetMapping
    public List<HomestayResponseDto> getAll() {
        return getAllHandler.handle();
    }

    @GetMapping("/top")
    public List<HomestayResponseDto> getTopRated() {
        return getTopHandler.handle();
    }
}
