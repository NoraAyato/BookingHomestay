package com.bookinghomestay.app.application.ai.query;

import com.bookinghomestay.app.application.ai.dto.AiChatHistoryResponse;
import com.bookinghomestay.app.application.ai.dto.AiStructuredResponse;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.domain.model.ai.AiChatSession;
import com.bookinghomestay.app.domain.model.ai.AiMessage;
import com.bookinghomestay.app.domain.repository.IAiChatSessionRepository;
import com.bookinghomestay.app.domain.service.AiChatService;
import com.bookinghomestay.app.infrastructure.ai.AiResponseStructureService;
import com.bookinghomestay.app.infrastructure.persistence.document.HomestayDocument;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Query handler for getting AI chat history
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GetAiChatHistoryQueryHandler {

    private final AiChatService aiChatService;
    private final IAiChatSessionRepository sessionRepository;
    private final AiResponseStructureService responseStructureService;

    public AiChatHistoryResponse handle(GetAiChatHistoryQuery query) {
        try {
            log.info("Getting AI chat history for session: {}", query.getSessionId());

            // Get session and validate user access
            Optional<AiChatSession> sessionOpt = sessionRepository.findById(query.getSessionId());

            if (sessionOpt.isEmpty()) {
                throw new IllegalArgumentException("Session not found: " + query.getSessionId());
            }

            AiChatSession session = sessionOpt.get();

            // Validate user has access to this session
            if (!session.getUserId().equals(query.getUserId())) {
                throw new IllegalArgumentException("User does not have access to this session");
            }

            // Get messages with pagination (DESC from MongoDB - newest first)
            List<AiMessage> messages = aiChatService.getSessionMessages(
                    query.getSessionId(),
                    query.getPageOrDefault(),
                    query.getLimitOrDefault());

            log.info("Retrieved {} messages from DB", messages.size());
            log.info("Session has {} message IDs: {}", session.getMessageIds().size(), session.getMessageIds());

            // Already sorted DESC from MongoDB, no need to re-sort
            // messages = messages.stream()
            // .sorted((m1, m2) -> m2.getTimestamp().compareTo(m1.getTimestamp()))
            // .collect(Collectors.toList());

            if (!messages.isEmpty()) {
                log.info("First message (newest): {} at {}",
                        messages.get(0).getMessageId(),
                        messages.get(0).getTimestamp());
                log.info("Last message (oldest): {} at {}",
                        messages.get(messages.size() - 1).getMessageId(),
                        messages.get(messages.size() - 1).getTimestamp());
            }

            // Convert to DTOs
            List<AiChatHistoryResponse.MessageDto> messageDtos = messages.stream()
                    .map(this::toMessageDto)
                    .collect(Collectors.toList());

            // Calculate pagination info
            int totalMessages = session.getMessageIds().size();

            // Build PageResponse
            PageResponse<AiChatHistoryResponse.MessageDto> messagesPage = new PageResponse<>(
                    messageDtos,
                    totalMessages,
                    query.getPageOrDefault(),
                    query.getLimitOrDefault());

            return AiChatHistoryResponse.builder()
                    .sessionId(session.getSessionId())
                    .sessionStatus(session.getStatus().name())
                    .sessionCreatedAt(session.getCreatedAt())
                    .lastActivityAt(session.getLastActivityAt())
                    .messages(messagesPage)
                    .build();

        } catch (Exception e) {
            log.error("Error getting AI chat history", e);
            throw new RuntimeException("Failed to get chat history: " + e.getMessage());
        }
    }

    /**
     * Convert domain message to DTO
     */
    private AiChatHistoryResponse.MessageDto toMessageDto(AiMessage message) {
        String content = message.getContent();
        AiStructuredResponse structuredData = null;

        // If this is an AI response with homestay data, structure it
        if (message.isFromAi() && message.getMetadata() != null && message.getMetadata().containsKey("homestays")) {
            try {
                @SuppressWarnings("unchecked")
                List<HomestayDocument> homestays = (List<HomestayDocument>) message.getMetadata().get("homestays");
                String intent = (String) message.getMetadata().get("intent");

                if (homestays != null && !homestays.isEmpty()) {
                    structuredData = responseStructureService.structureResponse(
                            message.getContent(),
                            intent,
                            homestays);
                    
                    // Remove plain text content when structured data is available
                    content = null;
                }
            } catch (Exception e) {
                log.warn("Failed to structure response for message {}: {}", message.getMessageId(), e.getMessage());
            }
        }

        return AiChatHistoryResponse.MessageDto.builder()
                .messageId(message.getMessageId())
                .senderId(message.getSenderId())
                .senderName(message.getSenderName())
                .content(content)
                .structuredData(structuredData)
                .timestamp(message.getTimestamp())
                .type(message.getType().name())
                .detectedIntent(message.getDetectedIntent())
                .confidenceScore(message.getConfidenceScore())
                .build();
    }
}