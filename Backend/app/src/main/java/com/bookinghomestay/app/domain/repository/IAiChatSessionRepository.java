package com.bookinghomestay.app.domain.repository;

import com.bookinghomestay.app.domain.model.ai.AiChatSession;
import com.bookinghomestay.app.domain.model.ai.AiChatSession.SessionStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for AI Chat Session domain
 * Following DDD pattern for domain repository abstraction
 */
public interface IAiChatSessionRepository {

    /**
     * Find session by ID
     */
    Optional<AiChatSession> findById(String sessionId);

    /**
     * Find active session for user
     */
    Optional<AiChatSession> findActiveSessionByUserId(String userId);

    /**
     * Find all sessions for user
     */
    List<AiChatSession> findByUserId(String userId);

    /**
     * Find sessions by status
     */
    List<AiChatSession> findByStatus(SessionStatus status);

    /**
     * Find sessions created between dates
     */
    List<AiChatSession> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find expired sessions (for cleanup)
     */
    List<AiChatSession> findExpiredSessions(LocalDateTime cutoffTime);

    /**
     * Save or update session
     */
    AiChatSession save(AiChatSession session);

    /**
     * Delete session by ID
     */
    void deleteById(String sessionId);

    /**
     * Check if user has active session
     */
    boolean hasActiveSession(String userId);

    /**
     * Count sessions by user
     */
    long countByUserId(String userId);

    /**
     * Find recent sessions for user (last 30 days)
     */
    List<AiChatSession> findRecentSessionsByUserId(String userId, int limit);
}