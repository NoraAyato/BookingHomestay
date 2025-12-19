package com.bookinghomestay.app.api.controller.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.application.admin.news.command.NewsCreateCommand;
import com.bookinghomestay.app.application.admin.news.command.NewsCreateCommandHandler;
import com.bookinghomestay.app.application.admin.news.command.NewsDeleteCommandHandler;
import com.bookinghomestay.app.application.admin.news.command.NewsUpdateCommandHandler;
import com.bookinghomestay.app.application.admin.news.dto.NewsDataResponseDto;
import com.bookinghomestay.app.application.admin.news.dto.NewsStatsResponseDto;
import com.bookinghomestay.app.application.admin.news.dto.NewsUpdateRequestDto;
import com.bookinghomestay.app.application.admin.news.query.GetNewsDataQuery;
import com.bookinghomestay.app.application.admin.news.query.GetNewsDataQueryHandler;
import com.bookinghomestay.app.application.admin.news.query.GetNewsStatsQueryHandler;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/admin/newsmanager")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('Admin')")
public class NewsManagerController {
    private final GetNewsDataQueryHandler getNewsDataQueryHandler;
    private final GetNewsStatsQueryHandler getNewsStatsQueryHandler;
    private final NewsUpdateCommandHandler newsUpdateCommandHandler;
    private final NewsDeleteCommandHandler newsDeleteCommandHandler;
    private final NewsCreateCommandHandler newsCreateCommandHandler;

    @GetMapping()
    public ResponseEntity<ApiResponse<PageResponse<NewsDataResponseDto>>> getNewsData(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category) {
        PageResponse<NewsDataResponseDto> query = getNewsDataQueryHandler
                .handle(new GetNewsDataQuery(search, page, size, startDate, endDate, status, category));

        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy dữ liệu tin tức thành công", query));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Void>> createNews(@ModelAttribute NewsUpdateRequestDto dto) {
        String userId = SecurityUtils.getCurrentUserId();
        newsCreateCommandHandler.handle(new NewsCreateCommand(userId, dto.getTitle(), dto.getContent(), dto.getStatus(),
                dto.getCategoryId(), dto.isFeatured(), dto.getImage()));
        return ResponseEntity.ok(new ApiResponse<>(true, "Tạo tin tức thành công", null));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<NewsStatsResponseDto>> getNewsStats() {
        NewsStatsResponseDto stats = getNewsStatsQueryHandler.handle();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thống kê tin tức thành công", stats));
    }

    @PutMapping("{id}")
    public ResponseEntity<ApiResponse<Void>> updateNews(@PathVariable String id,
            @ModelAttribute NewsUpdateRequestDto dto) {
        newsUpdateCommandHandler.handle(dto, id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật tin tức thành công", null));
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNews(@PathVariable String id) {
        newsDeleteCommandHandler.handle(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Xóa tin tức thành công", null));
    }

}
