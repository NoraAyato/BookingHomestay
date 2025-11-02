package com.bookinghomestay.app.application.chat.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * Command: Gửi message
 */
@Getter
@Builder
@AllArgsConstructor
public class SendMessageCommand {
    private String conversationId;
    private String senderId;
    private String content;
}
