package com.bookinghomestay.app.api.controller.news;

import com.bookinghomestay.app.api.dto.common.ApiResponse;
import com.bookinghomestay.app.api.dto.tintuc.NewsDetailResponseDto;
import com.bookinghomestay.app.api.dto.tintuc.NewsResponseDto;
import com.bookinghomestay.app.application.news.query.GetAllNewsQueryHandler;
import com.bookinghomestay.app.application.news.query.GetNewsDetailQuery;
import com.bookinghomestay.app.application.news.query.GetNewsDetailQueryHandler;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {

    private final GetAllNewsQueryHandler getAllNewsQueryHandler;
    private final GetNewsDetailQueryHandler getNewsDetailQueryHandler;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NewsResponseDto>>> getAllNews() {
        List<NewsResponseDto> result = getAllNewsQueryHandler.handle();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Lấy danh sách tin tức thành công", result));
    }

    @GetMapping("/{maTinTuc}")
    public ResponseEntity<ApiResponse<NewsDetailResponseDto>> getDetail(@PathVariable String maTinTuc) {
        NewsDetailResponseDto dto = getNewsDetailQueryHandler.handle(new GetNewsDetailQuery(maTinTuc));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy chi tiết tin tức thành công", dto));
    }

}