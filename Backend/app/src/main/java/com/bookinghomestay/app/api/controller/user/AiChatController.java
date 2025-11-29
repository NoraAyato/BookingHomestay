package com.bookinghomestay.app.api.controller.user;

import com.bookinghomestay.app.application.ai.command.SendAiMessageCommand;
import com.bookinghomestay.app.application.ai.command.SendAiMessageCommandHandler;
import com.bookinghomestay.app.application.ai.dto.AiChatHistoryResponse;
import com.bookinghomestay.app.application.ai.dto.AiChatResponse;
import com.bookinghomestay.app.application.ai.dto.SendAiMessageRequest;
import com.bookinghomestay.app.application.ai.query.GetAiChatHistoryQuery;
import com.bookinghomestay.app.application.ai.query.GetAiChatHistoryQueryHandler;
import com.bookinghomestay.app.application.ai.query.GetAiChatSessionsQuery;
import com.bookinghomestay.app.application.ai.query.GetAiChatSessionsQueryHandler;
import com.bookinghomestay.app.application.ai.dto.AiChatSessionsResponse;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

/**
 * REST API Controller for AI Booking Assistant
 */
@Slf4j
@RestController
@RequestMapping("/api/ai-chat")
@RequiredArgsConstructor
public class AiChatController {

    private final SendAiMessageCommandHandler sendMessageHandler;
    private final GetAiChatHistoryQueryHandler getChatHistoryHandler;
    private final GetAiChatSessionsQueryHandler getSessionsHandler;

    /**
     * Send message to AI booking assistant
     */
    @PostMapping("/send")
    public ResponseEntity<ApiResponse<AiChatResponse>> sendMessage(
            @Valid @RequestBody SendAiMessageRequest request) {

        try {
            // Get current user ID from security context
            String userId = SecurityUtils.getCurrentUserId();

            // Create command (handler will fetch user details)
            SendAiMessageCommand command = SendAiMessageCommand.builder()
                    .userId(userId)
                    .message(request.getMessage())
                    .sessionId(request.getSessionId())
                    .build();

            // Handle command
            AiChatResponse response = sendMessageHandler.handle(command);

            return ResponseEntity.ok(
                    new ApiResponse<>(true, "AI response generated successfully", response));

        } catch (IllegalArgumentException e) {
            log.error("Invalid request: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            log.error("Error in AI chat send message", e);
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to process message: " + e.getMessage(), null));
        }
    }

    /**
     * Get all AI chat sessions for current user
     */
    @GetMapping("/sessions")
    public ResponseEntity<ApiResponse<AiChatSessionsResponse>> getAllSessions() {
        try {
            String userId = SecurityUtils.getCurrentUserId();
            log.info("Getting all sessions for user: {}", userId);

            GetAiChatSessionsQuery query = GetAiChatSessionsQuery.builder()
                    .userId(userId)
                    .limit(20)
                    .build();

            AiChatSessionsResponse response = getSessionsHandler.handle(query);

            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Sessions retrieved successfully", response));

        } catch (Exception e) {
            log.error("Error getting all sessions", e);
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to get sessions: " + e.getMessage(), null));
        }
    }

    /**
     * Get AI chat history for session
     */
    @GetMapping("/history/{sessionId}")
    public ResponseEntity<ApiResponse<AiChatHistoryResponse>> getChatHistory(
            @PathVariable String sessionId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer limit) {

        try {
            String userId = SecurityUtils.getCurrentUserId();

            GetAiChatHistoryQuery query = GetAiChatHistoryQuery.builder()
                    .sessionId(sessionId)
                    .userId(userId)
                    .page(page)
                    .limit(limit)
                    .build();

            AiChatHistoryResponse response = getChatHistoryHandler.handle(query);

            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Chat history retrieved successfully", response));

        } catch (Exception e) {
            log.error("Error getting AI chat history", e);
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to get chat history: " + e.getMessage(), null));
        }
    }
}