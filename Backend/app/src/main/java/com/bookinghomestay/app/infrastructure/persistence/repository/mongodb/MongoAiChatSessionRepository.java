package com.bookinghomestay.app.infrastructure.persistence.repository.mongodb;

import com.bookinghomestay.app.infrastructure.persistence.document.AiChatSessionDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * MongoDB repository for AI Chat Session documents
 */
@Repository
public interface MongoAiChatSessionRepository extends MongoRepository<AiChatSessionDocument, String> {

    /**
     * Find active session for user
     */
    @Query("{'userId': ?0, 'status': 'ACTIVE'}")
    Optional<AiChatSessionDocument> findActiveSessionByUserId(String userId);

    /**
     * Find sessions by user ID
     */
    List<AiChatSessionDocument> findByUserId(String userId);

    /**
     * Find sessions by status
     */
    List<AiChatSessionDocument> findByStatus(String status);

    /**
     * Find sessions created between dates
     */
    List<AiChatSessionDocument> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find expired sessions
     */
    @Query("{'lastActivityAt': {$lt: ?0}, 'status': {$in: ['ACTIVE']}}")
    List<AiChatSessionDocument> findExpiredSessions(LocalDateTime cutoffTime);

    /**
     * Check if user has active session
     */
    @Query(value = "{'userId': ?0, 'status': 'ACTIVE'}", exists = true)
    boolean existsActiveSessionByUserId(String userId);

    /**
     * Count sessions by user
     */
    long countByUserId(String userId);

    /**
     * Find recent sessions for user (ordered by created date desc)
     */
    @Query("{'userId': ?0, 'createdAt': {$gte: ?1}}")
    List<AiChatSessionDocument> findRecentSessionsByUserIdAndCreatedAtAfter(String userId, LocalDateTime since);

    /**
     * Find sessions that completed booking
     */
    @Query("{'bookingCompleted': true}")
    List<AiChatSessionDocument> findCompletedBookingSessions();

    /**
     * Find sessions for analytics
     */
    @Query("{'createdAt': {$gte: ?0, $lte: ?1}, 'status': {$ne: 'ABANDONED'}}")
    List<AiChatSessionDocument> findAnalyticsData(LocalDateTime startDate, LocalDateTime endDate);
}