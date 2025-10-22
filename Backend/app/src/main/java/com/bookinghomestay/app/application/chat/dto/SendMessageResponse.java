package com.bookinghomestay.app.application.chat.dto;

import lombok.Builder;
import lombok.Data;

/**
 * Response sau khi gửi message thành công
 */
@Data
@Builder
public class SendMessageResponse {
    private String messageId;
    private String conversationId;
    private String senderId;
    private String senderName;
    private String content;
    private Long sentAt;
}
