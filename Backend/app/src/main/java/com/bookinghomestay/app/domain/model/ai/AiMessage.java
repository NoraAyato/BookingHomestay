package com.bookinghomestay.app.domain.model.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Domain model for AI Chat Message
 * Represents individual messages in AI booking assistant conversation
 */
@Getter
@Builder
@AllArgsConstructor
public class AiMessage {

    private final String messageId;
    private final String sessionId;
    private final String senderId; // "user" or "ai-assistant"
    private final String senderName;
    private final String content;
    private final LocalDateTime timestamp;
    private final MessageType type;
    private final Map<String, Object> metadata; // Additional data like detected intent, confidence, etc.
    private final String originalQuery; // Original user query if this is AI response
    private final String detectedIntent; // Intent detected from user message
    private final Double confidenceScore; // AI confidence in response (0.0 to 1.0)

    /**
     * Message type enum
     */
    public enum MessageType {
        USER_TEXT, // User text message
        AI_RESPONSE, // AI assistant response
        BOOKING_SUGGESTION, // AI suggested homestay/room
        BOOKING_CONFIRMATION, // Booking confirmation message
        SYSTEM_INFO, // System information
        ERROR_MESSAGE // Error handling message
    }

    /**
     * Business logic: Check if message is from user
     */
    public boolean isFromUser() {
        return "user".equals(senderId);
    }

    /**
     * Business logic: Check if message is from AI
     */
    public boolean isFromAi() {
        return "ai-assistant".equals(senderId);
    }

    /**
     * Business logic: Check if this is a booking-related message
     */
    public boolean isBookingRelated() {
        return type == MessageType.BOOKING_SUGGESTION ||
                type == MessageType.BOOKING_CONFIRMATION ||
                (detectedIntent != null && detectedIntent.contains("booking"));
    }

    /**
     * Business logic: Check if AI response has high confidence
     */
    public boolean hasHighConfidence() {
        return confidenceScore != null && confidenceScore >= 0.8;
    }

    /**
     * Business logic: Check if message needs human intervention
     */
    public boolean needsHumanIntervention() {
        return type == MessageType.ERROR_MESSAGE ||
                (confidenceScore != null && confidenceScore < 0.5);
    }

    /**
     * Business logic: Validate message data
     */
    public boolean isValid() {
        return messageId != null && !messageId.isEmpty()
                && sessionId != null && !sessionId.isEmpty()
                && senderId != null && !senderId.isEmpty()
                && content != null && !content.trim().isEmpty()
                && type != null;
    }

    /**
     * Business logic: Get formatted display content
     */
    public String getDisplayContent() {
        if (content == null || content.trim().isEmpty()) {
            return "[Tin nhắn trống]";
        }

        // Truncate long messages for display
        if (content.length() > 500) {
            return content.substring(0, 497) + "...";
        }

        return content.trim();
    }
}