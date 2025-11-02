package com.bookinghomestay.app.application.chat.query;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * Query: Lấy danh sách conversations của user
 */
@Getter
@Builder
@AllArgsConstructor
public class GetUserConversationsQuery {
    private String userId;
}
