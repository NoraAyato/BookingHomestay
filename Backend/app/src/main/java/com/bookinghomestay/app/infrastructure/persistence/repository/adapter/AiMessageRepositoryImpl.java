package com.bookinghomestay.app.infrastructure.persistence.repository.adapter;

import com.bookinghomestay.app.domain.model.ai.AiMessage;
import com.bookinghomestay.app.domain.repository.IAiMessageRepository;
import com.bookinghomestay.app.infrastructure.persistence.document.AiMessageDocument;
import com.bookinghomestay.app.infrastructure.persistence.repository.mongodb.MongoAiMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Adapter implementation for AI Message Repository
 * Converts between domain models and MongoDB documents
 */
@Repository
@RequiredArgsConstructor
public class AiMessageRepositoryImpl implements IAiMessageRepository {

    private final MongoAiMessageRepository mongoRepository;

    @Override
    public Optional<AiMessage> findById(String messageId) {
        return mongoRepository.findById(messageId)
                .map(this::toDomain);
    }

    @Override
    public List<AiMessage> findBySessionId(String sessionId) {
        return mongoRepository.findBySessionIdOrderByTimestampAsc(sessionId)
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<AiMessage> findBySessionIdOrderByTimestampAsc(String sessionId, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        // Query DESC from MongoDB to get newest messages first
        return mongoRepository.findBySessionIdOrderByTimestampDesc(sessionId, pageable)
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<AiMessage> findBySenderId(String senderId) {
        return mongoRepository.findBySenderId(senderId)
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<AiMessage> findByType(AiMessage.MessageType type) {
        return mongoRepository.findByType(type.name())
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<AiMessage> findByTimestampBetween(LocalDateTime startTime, LocalDateTime endTime) {
        return mongoRepository.findByTimestampBetween(startTime, endTime)
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<AiMessage> findByDetectedIntent(String intent) {
        return mongoRepository.findByDetectedIntent(intent)
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<AiMessage> findByConfidenceScoreLessThan(Double threshold) {
        return mongoRepository.findByConfidenceScoreLessThan(threshold)
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<AiMessage> findLatestMessageBySessionId(String sessionId) {
        return mongoRepository.findTopBySessionIdOrderByTimestampDesc(sessionId)
                .map(this::toDomain);
    }

    @Override
    public AiMessage save(AiMessage message) {
        AiMessageDocument document = toDocument(message);
        document.setUpdatedAt(LocalDateTime.now());
        AiMessageDocument saved = mongoRepository.save(document);
        return toDomain(saved);
    }

    @Override
    public void deleteById(String messageId) {
        mongoRepository.deleteById(messageId);
    }

    @Override
    public void deleteBySessionId(String sessionId) {
        mongoRepository.deleteBySessionId(sessionId);
    }

    @Override
    public long countBySessionId(String sessionId) {
        return mongoRepository.countBySessionId(sessionId);
    }

    @Override
    public long countBySenderId(String senderId) {
        return mongoRepository.countBySenderId(senderId);
    }

    @Override
    public List<AiMessage> findMessagesNeedingIntervention() {
        return mongoRepository.findMessagesNeedingIntervention()
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    /**
     * Convert MongoDB document to domain model
     */
    private AiMessage toDomain(AiMessageDocument doc) {
        return AiMessage.builder()
                .messageId(doc.getMessageId())
                .sessionId(doc.getSessionId())
                .senderId(doc.getSenderId())
                .senderName(doc.getSenderName())
                .content(doc.getContent())
                .timestamp(doc.getTimestamp())
                .type(AiMessage.MessageType.valueOf(doc.getType()))
                .metadata(doc.getMetadata())
                .originalQuery(doc.getOriginalQuery())
                .detectedIntent(doc.getDetectedIntent())
                .confidenceScore(doc.getConfidenceScore())
                .build();
    }

    /**
     * Convert domain model to MongoDB document
     */
    private AiMessageDocument toDocument(AiMessage message) {
        return AiMessageDocument.builder()
                .messageId(message.getMessageId())
                .sessionId(message.getSessionId())
                .senderId(message.getSenderId())
                .senderName(message.getSenderName())
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .type(message.getType().name())
                .metadata(message.getMetadata())
                .originalQuery(message.getOriginalQuery())
                .detectedIntent(message.getDetectedIntent())
                .confidenceScore(message.getConfidenceScore())
                .createdAt(LocalDateTime.now())
                .build();
    }
}