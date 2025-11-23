package com.bookinghomestay.app.application.ai.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Command to send message to AI chat
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendAiMessageCommand {

    private String userId;
    private String message;
    private String sessionId; // Optional - if null, will use existing active session or create new
}