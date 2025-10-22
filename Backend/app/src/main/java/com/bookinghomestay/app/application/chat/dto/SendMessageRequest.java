package com.bookinghomestay.app.application.chat.dto;

import lombok.Data;

/**
 * Request để gửi message
 * 
 * Backend sẽ:
 * 1. Validate conversationId có tồn tại
 * 2. Validate senderId có quyền gửi message trong conversation này
 * 3. Gửi message vào Firebase
 * 4. Update lastMessage trong conversation
 */
@Data
public class SendMessageRequest {
    private String conversationId;
    private String senderId;
    private String content;
}
