package com.bookinghomestay.app.api.controller.ai;

import com.bookinghomestay.app.infrastructure.ai.GeminiApiService;
import com.bookinghomestay.app.infrastructure.service.HomestayDataSyncService;
import com.bookinghomestay.app.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Test controller for AI integration demo
 */
@Slf4j
@RestController
@RequestMapping("/api/ai-test")
@RequiredArgsConstructor
public class AiTestController {

    private final GeminiApiService geminiApiService;
    private final HomestayDataSyncService syncService;

    /**
     * Test Gemini API connection
     */
    @PostMapping("/gemini")
    public ResponseEntity<ApiResponse<String>> testGemini(@RequestBody String message) {
        try {
            GeminiApiService.GeminiResponse response = geminiApiService.generateContent(
                    "Bạn là trợ lý AI hỗ trợ đặt homestay. Trả lời câu hỏi sau bằng tiếng Việt: " + message);

            if (response.isSuccess()) {
                return ResponseEntity.ok(
                        new ApiResponse<>(true, "Gemini API working", response.getContent()));
            } else {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<>(false, "Gemini API error: " + response.getError(), null));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Error: " + e.getMessage(), null));
        }
    }

    /**
     * Test intent detection
     */
    @PostMapping("/intent")
    public ResponseEntity<ApiResponse<String>> testIntentDetection(@RequestBody String message) {
        try {
            String intent = geminiApiService.detectIntent(message);
            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Intent detected", intent));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Error: " + e.getMessage(), null));
        }
    }

    /**
     * Test data sync
     */
    @PostMapping("/sync")
    public ResponseEntity<ApiResponse<String>> testDataSync() {
        try {
            syncService.syncAllHomestays();
            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Data sync started", "Check logs for progress"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Sync error: " + e.getMessage(), null));
        }
    }

    /**
     * Get sync status
     */
    @GetMapping("/sync/status")
    public ResponseEntity<ApiResponse<HomestayDataSyncService.SyncStatus>> getSyncStatus() {
        try {
            HomestayDataSyncService.SyncStatus status = syncService.getSyncStatus();
            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Sync status retrieved", status));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Error: " + e.getMessage(), null));
        }
    }

    /**
     * Basic health check
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "AI services are up and running", "OK"));
    }
}