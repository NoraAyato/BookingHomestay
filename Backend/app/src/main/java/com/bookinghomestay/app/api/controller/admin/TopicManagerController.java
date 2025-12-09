package com.bookinghomestay.app.api.controller.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.application.admin.topic.command.CreateTopicCommandHandler;
import com.bookinghomestay.app.application.admin.topic.command.DeleteTopicCommandHandler;
import com.bookinghomestay.app.application.admin.topic.command.UpdateTopicCommandHandler;
import com.bookinghomestay.app.application.admin.topic.dto.TopicCreateRequestDto;
import com.bookinghomestay.app.application.admin.topic.dto.TopicDataResponseDto;
import com.bookinghomestay.app.application.admin.topic.dto.TopicStatsDataReponse;
import com.bookinghomestay.app.application.admin.topic.dto.TopicUpdateRequestDto;
import com.bookinghomestay.app.application.admin.topic.query.GetTopicDataQuery;
import com.bookinghomestay.app.application.admin.topic.query.GetTopicDataQueryHandler;
import com.bookinghomestay.app.application.admin.topic.query.GetTopicStatsQueryHandler;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.common.response.PageResponse;
import com.google.api.services.storage.Storage.BucketAccessControls.Update;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/admin/topicsmanager")
@RequiredArgsConstructor
@Slf4j
public class TopicManagerController {
    private final GetTopicDataQueryHandler getTopicDataQueryHandler;
    private final CreateTopicCommandHandler createTopicCommandHandler;
    private final UpdateTopicCommandHandler updateTopicCommandHandler;
    private final DeleteTopicCommandHandler deleteTopicCommandHandler;
    private final GetTopicStatsQueryHandler getTopicStatsQueryHandler;

    @GetMapping()
    public ResponseEntity<ApiResponse<PageResponse<TopicDataResponseDto>>> getTopicData(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String status) {
        PageResponse<TopicDataResponseDto> response = getTopicDataQueryHandler.handle(
                new GetTopicDataQuery(search, page, size, status));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy dữ liệu chủ đề thành công !", response));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<TopicStatsDataReponse>> getTopicStats() {
        TopicStatsDataReponse response = getTopicStatsQueryHandler.handler();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thống kê chủ đề thành công !", response));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Void>> createTopics(@RequestBody TopicCreateRequestDto dto) {
        createTopicCommandHandler.handler(dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Thêm chủ đề mới thành công !", null));
    }

    @PutMapping("{id}")
    public ResponseEntity<ApiResponse<Void>> updateTopic(@PathVariable String id,
            @ModelAttribute TopicUpdateRequestDto dto) {
        updateTopicCommandHandler.handle(id, dto);

        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật chủ đề thành công !", null));
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTopic(@PathVariable String id) {
        deleteTopicCommandHandler.handle(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Xóa chủ đề thành công !", null));
    }

}