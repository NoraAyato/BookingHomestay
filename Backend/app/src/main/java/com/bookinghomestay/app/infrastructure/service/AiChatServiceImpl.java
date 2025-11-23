package com.bookinghomestay.app.infrastructure.service;

import com.bookinghomestay.app.domain.model.ai.AiChatSession;
import com.bookinghomestay.app.domain.model.ai.AiMessage;
import com.bookinghomestay.app.domain.repository.IAiChatSessionRepository;
import com.bookinghomestay.app.domain.repository.IAiMessageRepository;
import com.bookinghomestay.app.domain.service.AiChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Implementation of AI Chat Service
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AiChatServiceImpl implements AiChatService {

    private final IAiChatSessionRepository sessionRepository;
    private final IAiMessageRepository messageRepository;

    @Override
    public AiChatSession createSession(String userId, String userName, String userAvatar) {
        String sessionId = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();

        AiChatSession session = AiChatSession.builder()
                .sessionId(sessionId)
                .userId(userId)
                .userName(userName)
                .userAvatar(userAvatar)
                .createdAt(now)
                .lastActivityAt(now)
                .status(AiChatSession.SessionStatus.ACTIVE)
                .sessionContext("{}") // Empty JSON context initially
                .messageIds(new ArrayList<>())
                .currentIntent("general_chat")
                .currentStep("greeting")
                .build();

        AiChatSession savedSession = sessionRepository.save(session);
        log.info("Created new AI chat session {} for user {}", sessionId, userId);

        return savedSession;
    }

    @Override
    public AiChatSession getOrCreateActiveSession(String userId, String userName, String userAvatar) {
        // Check if user has active session
        Optional<AiChatSession> existingSession = sessionRepository.findActiveSessionByUserId(userId);

        if (existingSession.isPresent()) {
            AiChatSession session = existingSession.get();

            // Check if session is still valid
            if (session.isActive()) {
                log.info("Found existing active session {} for user {}", session.getSessionId(), userId);
                updateSessionActivity(session.getSessionId());
                return session;
            } else {
                // End expired session
                endSession(session.getSessionId(), AiChatSession.SessionStatus.EXPIRED);
            }
        }

        // Create new session
        return createSession(userId, userName, userAvatar);
    }

    @Override
    public void endSession(String sessionId, AiChatSession.SessionStatus reason) {
        Optional<AiChatSession> sessionOpt = sessionRepository.findById(sessionId);

        if (sessionOpt.isPresent()) {
            AiChatSession session = sessionOpt.get();

            // Create updated session with new status
            AiChatSession updatedSession = AiChatSession.builder()
                    .sessionId(session.getSessionId())
                    .userId(session.getUserId())
                    .userName(session.getUserName())
                    .userAvatar(session.getUserAvatar())
                    .createdAt(session.getCreatedAt())
                    .lastActivityAt(LocalDateTime.now())
                    .status(reason)
                    .sessionContext(session.getSessionContext())
                    .messageIds(session.getMessageIds())
                    .currentIntent(session.getCurrentIntent())
                    .currentStep("ended")
                    .build();

            sessionRepository.save(updatedSession);
            log.info("Ended session {} with reason: {}", sessionId, reason);
        }
    }

    @Override
    public AiChatSession updateSessionContext(String sessionId, String contextUpdate) {
        Optional<AiChatSession> sessionOpt = sessionRepository.findById(sessionId);

        if (sessionOpt.isPresent()) {
            AiChatSession session = sessionOpt.get();

            AiChatSession updatedSession = AiChatSession.builder()
                    .sessionId(session.getSessionId())
                    .userId(session.getUserId())
                    .userName(session.getUserName())
                    .userAvatar(session.getUserAvatar())
                    .createdAt(session.getCreatedAt())
                    .lastActivityAt(LocalDateTime.now())
                    .status(session.getStatus())
                    .sessionContext(contextUpdate)
                    .messageIds(session.getMessageIds())
                    .currentIntent(session.getCurrentIntent())
                    .currentStep(session.getCurrentStep())
                    .build();

            return sessionRepository.save(updatedSession);
        }

        throw new IllegalArgumentException("Session not found: " + sessionId);
    }

    @Override
    public AiChatSession addMessageToSession(String sessionId, AiMessage message) {
        log.info("=== ADDING MESSAGE TO SESSION ===");
        log.info("Session ID: {}", sessionId);
        log.info("Message ID: {}", message.getMessageId());
        log.info("Message Type: {}", message.getType());
        log.info("Message Content: {}", message.getContent());
        AiMessage savedMessage = null;
        // Save message first
        try {
            savedMessage = messageRepository.save(message);
            log.info("✅ Message saved to MongoDB successfully: {}", savedMessage.getMessageId());
        } catch (Exception e) {
            log.error("❌ FAILED to save message to MongoDB", e);
            throw new RuntimeException("Failed to save message", e);
        }

        // Update session with message reference
        Optional<AiChatSession> sessionOpt = sessionRepository.findById(sessionId);

        if (sessionOpt.isPresent()) {
            AiChatSession session = sessionOpt.get();

            // Add message ID to session
            List<String> messageIds = new ArrayList<>(session.getMessageIds());
            messageIds.add(savedMessage.getMessageId());

            // Update current intent if message is from user
            String currentIntent = session.getCurrentIntent();
            if (savedMessage.isFromUser() && savedMessage.getDetectedIntent() != null) {
                currentIntent = savedMessage.getDetectedIntent();
            }

            AiChatSession updatedSession = AiChatSession.builder()
                    .sessionId(session.getSessionId())
                    .userId(session.getUserId())
                    .userName(session.getUserName())
                    .userAvatar(session.getUserAvatar())
                    .createdAt(session.getCreatedAt())
                    .lastActivityAt(LocalDateTime.now())
                    .status(session.getStatus())
                    .sessionContext(session.getSessionContext())
                    .messageIds(messageIds)
                    .currentIntent(currentIntent)
                    .currentStep(session.getCurrentStep())
                    .build();

            return sessionRepository.save(updatedSession);
        }

        throw new IllegalArgumentException("Session not found: " + sessionId);
    }

    @Override
    public List<AiMessage> getSessionMessages(String sessionId, int page, int limit) {
        return messageRepository.findBySessionIdOrderByTimestampAsc(sessionId, page, limit);
    }

    @Override
    public boolean isSessionActive(String sessionId) {
        Optional<AiChatSession> sessionOpt = sessionRepository.findById(sessionId);
        return sessionOpt.map(AiChatSession::isActive).orElse(false);
    }

    @Override
    public List<AiChatSession> getUserRecentSessions(String userId, int limit) {
        return sessionRepository.findRecentSessionsByUserId(userId, limit);
    }

    @Override
    public int cleanupExpiredSessions() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusHours(24);
        List<AiChatSession> expiredSessions = sessionRepository.findExpiredSessions(cutoffTime);

        int cleanedUp = 0;
        for (AiChatSession session : expiredSessions) {
            try {
                endSession(session.getSessionId(), AiChatSession.SessionStatus.EXPIRED);
                cleanedUp++;
            } catch (Exception e) {
                log.error("Error cleaning up session {}", session.getSessionId(), e);
            }
        }

        log.info("Cleaned up {} expired AI chat sessions", cleanedUp);
        return cleanedUp;
    }

    @Override
    public void updateSessionActivity(String sessionId) {
        Optional<AiChatSession> sessionOpt = sessionRepository.findById(sessionId);

        if (sessionOpt.isPresent()) {
            AiChatSession session = sessionOpt.get();

            AiChatSession updatedSession = AiChatSession.builder()
                    .sessionId(session.getSessionId())
                    .userId(session.getUserId())
                    .userName(session.getUserName())
                    .userAvatar(session.getUserAvatar())
                    .createdAt(session.getCreatedAt())
                    .lastActivityAt(LocalDateTime.now())
                    .status(session.getStatus())
                    .sessionContext(session.getSessionContext())
                    .messageIds(session.getMessageIds())
                    .currentIntent(session.getCurrentIntent())
                    .currentStep(session.getCurrentStep())
                    .build();

            sessionRepository.save(updatedSession);
        }
    }

    @Override
    public Optional<AiChatSession> getValidSession(String sessionId) {
        Optional<AiChatSession> sessionOpt = sessionRepository.findById(sessionId);

        if (sessionOpt.isPresent()) {
            AiChatSession session = sessionOpt.get();
            if (session.isValid() && session.canAcceptMessages()) {
                return sessionOpt;
            }
        }

        return Optional.empty();
    }
}