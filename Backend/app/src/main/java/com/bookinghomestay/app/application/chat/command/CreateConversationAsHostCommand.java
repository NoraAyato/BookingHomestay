package com.bookinghomestay.app.application.chat.command;

import lombok.Builder;
import lombok.Data;

/**
 * Command for Host to create conversation with Customer
 */
@Data
@Builder
public class CreateConversationAsHostCommand {
    private String hostId; // Lấy từ JWT token
    private String customerId; // Customer muốn nhắn
    private String homestayId; // Homestay liên quan
}
