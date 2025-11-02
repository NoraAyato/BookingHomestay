package com.bookinghomestay.app.application.chat.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * Command: Tạo conversation mới
 * 
 * Command pattern giúp tách biệt request từ Controller
 * và business logic trong Handler
 */
@Getter
@Builder
@AllArgsConstructor
public class CreateConversationCommand {
    private String userId;
    private String hostId;
    private String homestayId;
}
