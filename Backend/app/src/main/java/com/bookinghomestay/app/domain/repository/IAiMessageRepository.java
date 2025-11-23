package com.bookinghomestay.app.domain.repository;

import com.bookinghomestay.app.domain.model.ai.AiMessage;
import com.bookinghomestay.app.domain.model.ai.AiMessage.MessageType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for AI Message domain
 * Following DDD pattern for domain repository abstraction
 */
public interface IAiMessageRepository {

    /**
     * Find message by ID
     */
    Optional<AiMessage> findById(String messageId);

    /**
     * Find messages by session ID
     */
    List<AiMessage> findBySessionId(String sessionId);

    /**
     * Find messages by session ID with pagination
     */
    List<AiMessage> findBySessionIdOrderByTimestampAsc(String sessionId, int page, int limit);

    /**
     * Find messages by sender ID
     */
    List<AiMessage> findBySenderId(String senderId);

    /**
     * Find messages by type
     */
    List<AiMessage> findByType(MessageType type);

    /**
     * Find messages between timestamps
     */
    List<AiMessage> findByTimestampBetween(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * Find messages by detected intent
     */
    List<AiMessage> findByDetectedIntent(String intent);

    /**
     * Find messages with low confidence (for improvement)
     */
    List<AiMessage> findByConfidenceScoreLessThan(Double threshold);

    /**
     * Find latest message in session
     */
    Optional<AiMessage> findLatestMessageBySessionId(String sessionId);

    /**
     * Save or update message
     */
    AiMessage save(AiMessage message);

    /**
     * Delete message by ID
     */
    void deleteById(String messageId);

    /**
     * Delete all messages in session
     */
    void deleteBySessionId(String sessionId);

    /**
     * Count messages in session
     */
    long countBySessionId(String sessionId);

    /**
     * Count messages by user
     */
    long countBySenderId(String senderId);

    /**
     * Find messages needing human intervention
     */
    List<AiMessage> findMessagesNeedingIntervention();
}