package com.bookinghomestay.app.infrastructure.persistence.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

/**
 * MongoDB document for AI Chat Session
 * Maps to ai_chat_sessions collection
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ai_chat_sessions")
public class AiChatSessionDocument {

    @Id
    private String sessionId;

    @Field("user_id")
    private String userId;

    @Field("user_name")
    private String userName;

    @Field("user_avatar")
    private String userAvatar;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("last_activity_at")
    private LocalDateTime lastActivityAt;

    @Field("status")
    private String status; // ACTIVE, COMPLETED, ABANDONED, EXPIRED

    @Field("session_context")
    private String sessionContext; // JSON string

    @Field("message_ids")
    private List<String> messageIds;

    @Field("current_intent")
    private String currentIntent;

    @Field("current_step")
    private String currentStep;

    // Metadata for analytics
    @Field("total_messages")
    private Integer totalMessages;

    @Field("session_duration_minutes")
    private Long sessionDurationMinutes;

    @Field("booking_completed")
    private Boolean bookingCompleted;

    @Field("satisfaction_score")
    private Double satisfactionScore; // User feedback score 1-5

    @Field("created_by")
    private String createdBy; // System info

    @Field("updated_at")
    private LocalDateTime updatedAt;
}