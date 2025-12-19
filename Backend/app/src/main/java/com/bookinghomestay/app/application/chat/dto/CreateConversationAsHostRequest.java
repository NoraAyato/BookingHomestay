package com.bookinghomestay.app.application.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request cho Host tạo conversation với Customer
 * Host chỉ cần truyền customerId và homestayId
 * HostId sẽ tự động lấy từ JWT token
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateConversationAsHostRequest {
    private String customerId;
    private String homestayId;
}
