package com.bookinghomestay.app.infrastructure.persistence.repository.mongodb;

import com.bookinghomestay.app.infrastructure.persistence.document.AiMessageDocument;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * MongoDB repository for AI Message documents
 */
@Repository
public interface MongoAiMessageRepository extends MongoRepository<AiMessageDocument, String> {

    /**
     * Find messages by session ID ordered by timestamp
     */
    List<AiMessageDocument> findBySessionIdOrderByTimestampAsc(String sessionId);

    /**
     * Find messages by session ID with pagination (DESC - newest first)
     */
    List<AiMessageDocument> findBySessionIdOrderByTimestampDesc(String sessionId, Pageable pageable);

    /**
     * Find messages by sender ID
     */
    List<AiMessageDocument> findBySenderId(String senderId);

    /**
     * Find messages by type
     */
    List<AiMessageDocument> findByType(String type);

    /**
     * Find messages between timestamps
     */
    List<AiMessageDocument> findByTimestampBetween(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * Find messages by detected intent
     */
    List<AiMessageDocument> findByDetectedIntent(String intent);

    /**
     * Find messages with low confidence
     */
    @Query("{'confidenceScore': {$lt: ?0}}")
    List<AiMessageDocument> findByConfidenceScoreLessThan(Double threshold);

    /**
     * Find latest message in session
     */
    @Query("{'sessionId': ?0}")
    Optional<AiMessageDocument> findTopBySessionIdOrderByTimestampDesc(String sessionId);

    /**
     * Delete all messages in session
     */
    void deleteBySessionId(String sessionId);

    /**
     * Count messages in session
     */
    long countBySessionId(String sessionId);

    /**
     * Count messages by sender
     */
    long countBySenderId(String senderId);

    /**
     * Find messages needing human intervention
     */
    @Query("{$or: [{'type': 'ERROR_MESSAGE'}, {'confidenceScore': {$lt: 0.5}}]}")
    List<AiMessageDocument> findMessagesNeedingIntervention();

    /**
     * Find messages with suggested homestays
     */
    @Query("{'suggestedHomestays': {$exists: true, $ne: []}}")
    List<AiMessageDocument> findMessagesWithSuggestions();

    /**
     * Find AI responses for analysis
     */
    @Query("{'senderId': 'ai-assistant', 'timestamp': {$gte: ?0}}")
    List<AiMessageDocument> findAiResponsesSince(LocalDateTime since);

    /**
     * Find messages by booking data exists
     */
    @Query("{'bookingData': {$exists: true, $ne: null}}")
    List<AiMessageDocument> findMessagesWithBookingData();
}