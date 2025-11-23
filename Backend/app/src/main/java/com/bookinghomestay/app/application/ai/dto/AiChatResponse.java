package com.bookinghomestay.app.application.ai.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for AI Chat interaction
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiChatResponse {

    private String sessionId;
    private MessageDto userMessage;
    private MessageDto aiResponse;
    private String detectedIntent;
    private Double confidenceScore;
    private String sessionStatus;
    private LocalDateTime timestamp;

    /**
     * Nested DTO for message information
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
        private AiStructuredResponse structuredData; // NEW: Structured response data
        private LocalDateTime timestamp;
        private String type;
    }
}