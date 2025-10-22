package com.bookinghomestay.app.application.chat.dto;

import lombok.Builder;
import lombok.Data;

/**
 * Response sau khi tạo conversation thành công
 * 
 * Trả về đầy đủ metadata để Frontend hiển thị:
 * - conversationId: để Frontend lưu lại và listen messages
 * - Thông tin user, host, homestay để hiển thị UI
 */
@Data
@Builder
public class CreateConversationResponse {
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
    private Long createdAt;
}
