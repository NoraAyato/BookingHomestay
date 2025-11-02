package com.bookinghomestay.app.domain.model.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;


@Getter
@Builder
@AllArgsConstructor
public class Message {

    private final String messageId;
    private final String conversationId;
    private final String senderId;
    private final String senderName;
    private final String senderAvatar;
    private final String content;
    private final long timestamp;
    private final MessageStatus status;
    private final MessageType type;

    /**
     * Message status enum
     */
    public enum MessageStatus {
        SENT, // Message đã gửi
        DELIVERED, // Message đã được deliver
        READ // Message đã được đọc
    }

    /**
     * Message type enum
     */
    public enum MessageType {
        TEXT, // Text message
        IMAGE, // Image message
        FILE, // File attachment
        SYSTEM // System notification
    }

    /**
     * Business logic: Check message đã được đọc chưa
     */
    public boolean isRead() {
        return status == MessageStatus.READ;
    }

    /**
     * Business logic: Check message có phải của hệ thống không
     */
    public boolean isSystemMessage() {
        return type == MessageType.SYSTEM;
    }

    /**
     * Business logic: Validate message
     */
    public boolean isValid() {
        return messageId != null && !messageId.isEmpty()
                && conversationId != null && !conversationId.isEmpty()
                && senderId != null && !senderId.isEmpty()
                && content != null && !content.isEmpty()
                && timestamp > 0;
    }
}
