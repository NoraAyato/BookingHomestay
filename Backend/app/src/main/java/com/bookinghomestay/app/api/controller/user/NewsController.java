package com.bookinghomestay.app.api.controller.user;

import com.bookinghomestay.app.application.news.dto.NewsDetailResponseDto;
import com.bookinghomestay.app.application.news.dto.NewsResponseDto;
import com.bookinghomestay.app.application.news.dto.TopicsResponseDto;
import com.bookinghomestay.app.application.news.query.GetAllNewsQuery;
import com.bookinghomestay.app.application.news.query.GetAllNewsQueryHandler;
import com.bookinghomestay.app.application.news.query.GetNewsDetailQuery;
import com.bookinghomestay.app.application.news.query.GetNewsDetailQueryHandler;
import com.bookinghomestay.app.application.news.query.GetTopTopicHandler;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.common.response.PageResponse;

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
    private final GetTopTopicHandler getTopTopicHandler;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<NewsResponseDto>>> getAllNews(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int size, @RequestParam(required = false) String idTopic) {
        PageResponse<NewsResponseDto> result = getAllNewsQueryHandler.handle(new GetAllNewsQuery(page, size, idTopic));
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Lấy danh sách tin tức thành công", result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NewsDetailResponseDto>> getDetail(@PathVariable String id) {
        NewsDetailResponseDto dto = getNewsDetailQueryHandler.handle(new GetNewsDetailQuery(id));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy chi tiết tin tức thành công", dto));
    }

    @GetMapping("/topic")
    public ResponseEntity<ApiResponse<List<TopicsResponseDto>>> getTopTopics() {
        List<TopicsResponseDto> topics = getTopTopicHandler.handle();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách chủ đề thành công", topics));
    }

}