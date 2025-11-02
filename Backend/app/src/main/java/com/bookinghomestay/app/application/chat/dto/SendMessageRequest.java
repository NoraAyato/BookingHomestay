package com.bookinghomestay.app.application.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
    private String conversationId;
    private String senderId;
    private String content;
}
