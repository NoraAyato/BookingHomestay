package com.bookinghomestay.app.application.chat.dto;

import lombok.Builder;
import lombok.Data;

/**
 * DTO cho message item
 * 
 * Frontend sẽ listen trực tiếp từ Firebase,
 * nhưng Backend có thể dùng DTO này khi cần:
 * - Lấy lịch sử messages
 * - Search messages
 * - Export chat history
 */
@Data
@Builder
public class MessageDto {
    private String messageId;
    private String senderId;
    private String senderName;
    private String senderAvatar;
    private String content;
    private Long sentAt;
    private Boolean isRead;
}
