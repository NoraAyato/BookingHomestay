package com.bookinghomestay.app.domain.model.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class Conversation {

    private final String conversationId;
    private final String userId;
    private final String userName;
    private final String userAvatar;
    private final String hostId;
    private final String hostName;
    private final String hostAvatar;
    private final String homestayId;
    private final String homestayName;
    private final String homestayImage;
    private final long createdAt;
    private final String lastMessage;
    private final long lastMessageAt;
    private final String lastSenderId;
    private final int unreadCount;

    public boolean isActive() {
        long thirtyDaysAgo = System.currentTimeMillis() - (30L * 24 * 60 * 60 * 1000);
        return lastMessageAt > thirtyDaysAgo;
    }

    /**
     * Business logic: Check xem có unread messages không
     */
    public boolean hasUnreadMessages() {
        return unreadCount > 0;
    }

    /**
     * Business logic: Validate conversation data
     */
    public boolean isValid() {
        return conversationId != null && !conversationId.isEmpty()
                && userId != null && !userId.isEmpty()
                && hostId != null && !hostId.isEmpty()
                && homestayId != null && !homestayId.isEmpty();
    }
}
