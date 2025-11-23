package com.bookinghomestay.app.infrastructure.persistence.repository.adapter;

import com.bookinghomestay.app.domain.model.ai.AiChatSession;
import com.bookinghomestay.app.domain.repository.IAiChatSessionRepository;
import com.bookinghomestay.app.infrastructure.persistence.document.AiChatSessionDocument;
import com.bookinghomestay.app.infrastructure.persistence.repository.mongodb.MongoAiChatSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Adapter implementation for AI Chat Session Repository
 * Converts between domain models and MongoDB documents
 */
@Repository
@RequiredArgsConstructor
public class AiChatSessionRepositoryImpl implements IAiChatSessionRepository {

    private final MongoAiChatSessionRepository mongoRepository;

    @Override
    public Optional<AiChatSession> findById(String sessionId) {
        return mongoRepository.findById(sessionId)
                .map(this::toDomain);
    }

    @Override
    public Optional<AiChatSession> findActiveSessionByUserId(String userId) {
        return mongoRepository.findActiveSessionByUserId(userId)
                .map(this::toDomain);
    }

    @Override
    public List<AiChatSession> findByUserId(String userId) {
        return mongoRepository.findByUserId(userId)
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<AiChatSession> findByStatus(AiChatSession.SessionStatus status) {
        return mongoRepository.findByStatus(status.name())
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<AiChatSession> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return mongoRepository.findByCreatedAtBetween(startDate, endDate)
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<AiChatSession> findExpiredSessions(LocalDateTime cutoffTime) {
        return mongoRepository.findExpiredSessions(cutoffTime)
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public AiChatSession save(AiChatSession session) {
        AiChatSessionDocument document = toDocument(session);
        document.setUpdatedAt(LocalDateTime.now());
        AiChatSessionDocument saved = mongoRepository.save(document);
        return toDomain(saved);
    }

    @Override
    public void deleteById(String sessionId) {
        mongoRepository.deleteById(sessionId);
    }

    @Override
    public boolean hasActiveSession(String userId) {
        return mongoRepository.existsActiveSessionByUserId(userId);
    }

    @Override
    public long countByUserId(String userId) {
        return mongoRepository.countByUserId(userId);
    }

    @Override
    public List<AiChatSession> findRecentSessionsByUserId(String userId, int limit) {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return mongoRepository.findRecentSessionsByUserIdAndCreatedAtAfter(userId, thirtyDaysAgo)
                .stream()
                .limit(limit)
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    /**
     * Convert MongoDB document to domain model
     */
    private AiChatSession toDomain(AiChatSessionDocument doc) {
        return AiChatSession.builder()
                .sessionId(doc.getSessionId())
                .userId(doc.getUserId())
                .userName(doc.getUserName())
                .userAvatar(doc.getUserAvatar())
                .createdAt(doc.getCreatedAt())
                .lastActivityAt(doc.getLastActivityAt())
                .status(AiChatSession.SessionStatus.valueOf(doc.getStatus()))
                .sessionContext(doc.getSessionContext())
                .messageIds(doc.getMessageIds())
                .currentIntent(doc.getCurrentIntent())
                .currentStep(doc.getCurrentStep())
                .build();
    }

    /**
     * Convert domain model to MongoDB document
     */
    private AiChatSessionDocument toDocument(AiChatSession session) {
        return AiChatSessionDocument.builder()
                .sessionId(session.getSessionId())
                .userId(session.getUserId())
                .userName(session.getUserName())
                .userAvatar(session.getUserAvatar())
                .createdAt(session.getCreatedAt())
                .lastActivityAt(session.getLastActivityAt())
                .status(session.getStatus().name())
                .sessionContext(session.getSessionContext())
                .messageIds(session.getMessageIds())
                .currentIntent(session.getCurrentIntent())
                .currentStep(session.getCurrentStep())
                .createdBy("ai-system")
                .build();
    }
}