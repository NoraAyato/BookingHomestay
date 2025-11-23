package com.bookinghomestay.app.domain.model.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Domain model for AI Chat Session
 * Represents a conversation session between user and AI booking assistant
 */
@Getter
@Builder
@AllArgsConstructor
public class AiChatSession {

    private final String sessionId;
    private final String userId;
    private final String userName;
    private final String userAvatar;
    private final LocalDateTime createdAt;
    private final LocalDateTime lastActivityAt;
    private final SessionStatus status;
    private final String sessionContext; // JSON string containing booking preferences
    private final List<String> messageIds; // References to AiMessage documents
    private final String currentIntent; // Current detected intent (search_homestay, book_room, etc.)
    private final String currentStep; // Current step in booking flow

    /**
     * Session status enum
     */
    public enum SessionStatus {
        ACTIVE, // Session đang active
        COMPLETED, // Booking completed successfully
        ABANDONED, // User abandoned session
        EXPIRED // Session expired due to inactivity
    }

    /**
     * Business logic: Check if session is still active
     */
    public boolean isActive() {
        return status == SessionStatus.ACTIVE &&
                lastActivityAt.isAfter(LocalDateTime.now().minusHours(24));
    }

    /**
     * Business logic: Check if session needs renewal
     */
    public boolean needsRenewal() {
        return lastActivityAt.isBefore(LocalDateTime.now().minusHours(2));
    }

    /**
     * Business logic: Validate session data
     */
    public boolean isValid() {
        return sessionId != null && !sessionId.isEmpty()
                && userId != null && !userId.isEmpty()
                && status != null;
    }

    /**
     * Business logic: Check if session can accept new messages
     */
    public boolean canAcceptMessages() {
        return isActive() && (status == SessionStatus.ACTIVE);
    }
}