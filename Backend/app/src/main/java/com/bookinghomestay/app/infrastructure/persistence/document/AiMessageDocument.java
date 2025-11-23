package com.bookinghomestay.app.infrastructure.persistence.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * MongoDB document for AI Message
 * Maps to ai_messages collection
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ai_messages")
public class AiMessageDocument {

    @Id
    private String messageId;

    @Field("session_id")
    private String sessionId;

    @Field("sender_id")
    private String senderId; // "user" or "ai-assistant"

    @Field("sender_name")
    private String senderName;

    @Field("content")
    private String content;

    @Field("timestamp")
    private LocalDateTime timestamp;

    @Field("type")
    private String type; // USER_TEXT, AI_RESPONSE, BOOKING_SUGGESTION, etc.

    @Field("metadata")
    private Map<String, Object> metadata;

    @Field("original_query")
    private String originalQuery;

    @Field("detected_intent")
    private String detectedIntent;

    @Field("confidence_score")
    private Double confidenceScore;

    // AI Processing metadata
    @Field("processing_time_ms")
    private Long processingTimeMs;

    @Field("gemini_model_used")
    private String geminiModelUsed; // e.g., "gemini-1.5-flash"

    @Field("tokens_used")
    private Integer tokensUsed;

    @Field("error_message")
    private String errorMessage; // If AI processing failed

    @Field("suggested_homestays")
    private java.util.List<String> suggestedHomestays; // Homestay IDs if this is suggestion

    @Field("booking_data")
    private Map<String, Object> bookingData; // Extracted booking info (dates, guests, etc.)

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updatedAt;
}