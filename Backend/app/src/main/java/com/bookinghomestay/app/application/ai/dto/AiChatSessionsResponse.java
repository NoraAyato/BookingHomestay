package com.bookinghomestay.app.application.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for sessions list response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiChatSessionsResponse {

    private List<SessionDto> sessions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SessionDto {
        private String sessionId;
        private String title; // optional title/preview
        private String lastMessage; // preview text
        private LocalDateTime lastActivityAt;
        private String status;
        private Integer unreadCount;
        private String userAvatar;
    }
}
