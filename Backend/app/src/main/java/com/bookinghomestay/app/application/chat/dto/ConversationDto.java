package com.bookinghomestay.app.application.chat.dto;

import lombok.Builder;
import lombok.Data;

/**
 * DTO cho conversation item trong danh sách
 * 
 * Dùng để hiển thị:
 * - Danh sách conversations của user
 * - Danh sách conversations của host
 * - Search conversations
 */
@Data
@Builder
public class ConversationDto {
    private String conversationId;
    private String userId;
    private String userName;
    private String userAvatar;
    private String hostId;
    private String hostName;
    private String hostAvatar;
    private String homestayId;
    private String homestayName;
    private String homestayImage;
    private String lastMessage;
    private Long lastMessageAt;
    private String lastSenderId;
    private Integer unreadCount; // Số tin nhắn chưa đọc
}
