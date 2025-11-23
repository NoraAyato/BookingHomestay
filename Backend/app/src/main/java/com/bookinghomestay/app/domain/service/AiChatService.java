package com.bookinghomestay.app.domain.service;

import com.bookinghomestay.app.domain.model.ai.AiChatSession;
import com.bookinghomestay.app.domain.model.ai.AiMessage;

import java.util.List;
import java.util.Optional;

/**
 * Domain service for AI Chat Session management
 * Contains business logic for AI chat sessions
 */
public interface AiChatService {

    /**
     * Create new AI chat session for user
     * 
     * @param userId     User ID
     * @param userName   User name
     * @param userAvatar User avatar URL
     * @return Created chat session
     */
    AiChatSession createSession(String userId, String userName, String userAvatar);

    /**
     * Get or create active session for user
     * 
     * @param userId     User ID
     * @param userName   User name
     * @param userAvatar User avatar URL
     * @return Active session (existing or newly created)
     */
    AiChatSession getOrCreateActiveSession(String userId, String userName, String userAvatar);

    /**
     * End current session
     * 
     * @param sessionId Session ID
     * @param reason    End reason (COMPLETED, ABANDONED, etc.)
     */
    void endSession(String sessionId, AiChatSession.SessionStatus reason);

    /**
     * Update session context with new information
     * 
     * @param sessionId     Session ID
     * @param contextUpdate Context update data
     * @return Updated session
     */
    AiChatSession updateSessionContext(String sessionId, String contextUpdate);

    /**
     * Add message to session
     * 
     * @param sessionId Session ID
     * @param message   Message to add
     * @return Updated session with message
     */
    AiChatSession addMessageToSession(String sessionId, AiMessage message);

    /**
     * Get session messages with pagination
     * 
     * @param sessionId Session ID
     * @param page      Page number (0-based)
     * @param limit     Messages per page
     * @return List of messages
     */
    List<AiMessage> getSessionMessages(String sessionId, int page, int limit);

    /**
     * Check if session is still valid and active
     * 
     * @param sessionId Session ID
     * @return true if valid and active
     */
    boolean isSessionActive(String sessionId);

    /**
     * Get user's recent sessions
     * 
     * @param userId User ID
     * @param limit  Maximum number of sessions
     * @return List of recent sessions
     */
    List<AiChatSession> getUserRecentSessions(String userId, int limit);

    /**
     * Clean up expired sessions
     * 
     * @return Number of sessions cleaned up
     */
    int cleanupExpiredSessions();

    /**
     * Update session activity timestamp
     * 
     * @param sessionId Session ID
     */
    void updateSessionActivity(String sessionId);

    /**
     * Get session by ID with validation
     * 
     * @param sessionId Session ID
     * @return Session if exists and valid
     */
    Optional<AiChatSession> getValidSession(String sessionId);
}