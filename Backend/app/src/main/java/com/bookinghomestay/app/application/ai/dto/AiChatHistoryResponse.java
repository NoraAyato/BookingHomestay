package com.bookinghomestay.app.application.ai.dto;

import com.bookinghomestay.app.common.response.PageResponse;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for AI chat history
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiChatHistoryResponse {

    private String sessionId;
    private String sessionStatus;
    private LocalDateTime sessionCreatedAt;
    private LocalDateTime lastActivityAt;
    private PageResponse<MessageDto> messages; // Dùng PageResponse thay vì List

    /**
     * Message DTO for history
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class MessageDto {
        private String messageId;
        private String senderId;
        private String senderName;
        private String content;
        private AiStructuredResponse structuredData; // NEW: Structured data for AI responses
        private LocalDateTime timestamp;
        private String type;
        private String detectedIntent;
        private Double confidenceScore;
    }
}