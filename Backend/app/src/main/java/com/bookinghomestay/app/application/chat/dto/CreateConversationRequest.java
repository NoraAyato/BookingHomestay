package com.bookinghomestay.app.application.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request để tạo hoặc lấy conversation
 * 
 * Frontend gửi 3 thông tin:
 * - userId: ID của user muốn chat
 * - hostId: ID của host (chủ homestay)
 * - homestayId: ID của homestay đang chat về
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateConversationRequest {
    private String userId;
    private String hostId;
    private String homestayId;
}
