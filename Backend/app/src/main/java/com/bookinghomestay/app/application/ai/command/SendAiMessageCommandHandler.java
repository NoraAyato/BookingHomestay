package com.bookinghomestay.app.application.ai.command;

import com.bookinghomestay.app.application.ai.dto.AiChatResponse;
import com.bookinghomestay.app.application.ai.dto.AiStructuredResponse;
import com.bookinghomestay.app.domain.model.ai.AiChatSession;
import com.bookinghomestay.app.domain.model.ai.AiMessage;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.AiChatService;
import com.bookinghomestay.app.domain.service.AiProcessingService;
import com.bookinghomestay.app.infrastructure.ai.AiResponseStructureService;
import com.bookinghomestay.app.infrastructure.persistence.document.HomestayDocument;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Command handler for sending AI messages
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SendAiMessageCommandHandler {

        private final AiChatService aiChatService;
        private final AiProcessingService aiProcessingService;
        private final IUserRepository userRepository;
        private final AiResponseStructureService responseStructureService;

        public AiChatResponse handle(SendAiMessageCommand command) {
                try {
                        log.info("Processing AI message for user: {}", command.getUserId());

                        // Get user info from repository
                        Optional<User> userOpt = userRepository.findById(command.getUserId());
                        if (userOpt.isEmpty()) {
                                throw new IllegalArgumentException("User not found: " + command.getUserId());
                        }
                        User user = userOpt.get();

                        // Get or create active session
                        AiChatSession session = aiChatService.getOrCreateActiveSession(
                                        command.getUserId(),
                                        user.getUserName(),
                                        user.getPicture());

                        // Create user message
                        AiMessage userMessage = AiMessage.builder()
                                        .messageId(UUID.randomUUID().toString())
                                        .sessionId(session.getSessionId())
                                        .senderId(command.getUserId())
                                        .senderName(user.getUserName())
                                        .content(command.getMessage())
                                        .timestamp(LocalDateTime.now())
                                        .type(AiMessage.MessageType.USER_TEXT)
                                        .detectedIntent(aiProcessingService.detectIntent(command.getMessage()))
                                        .build();

                        // Add user message to session
                        session = aiChatService.addMessageToSession(session.getSessionId(), userMessage);

                        // Process message and generate AI response
                        AiMessage aiResponse = aiProcessingService.processUserMessage(
                                        command.getMessage(),
                                        session.getSessionContext());

                        // Set session ID for AI response
                        AiMessage aiResponseWithSession = AiMessage.builder()
                                        .messageId(aiResponse.getMessageId())
                                        .sessionId(session.getSessionId())
                                        .senderId(aiResponse.getSenderId())
                                        .senderName(aiResponse.getSenderName())
                                        .content(aiResponse.getContent())
                                        .timestamp(aiResponse.getTimestamp())
                                        .type(aiResponse.getType())
                                        .metadata(aiResponse.getMetadata())
                                        .originalQuery(aiResponse.getOriginalQuery())
                                        .detectedIntent(aiResponse.getDetectedIntent())
                                        .confidenceScore(aiResponse.getConfidenceScore())
                                        .build();

                        // Add AI response to session
                        session = aiChatService.addMessageToSession(session.getSessionId(), aiResponseWithSession);

                        // Create response DTO
                        return AiChatResponse.builder()
                                        .sessionId(session.getSessionId())
                                        .userMessage(toMessageDto(userMessage))
                                        .aiResponse(toMessageDto(aiResponseWithSession))
                                        .detectedIntent(userMessage.getDetectedIntent())
                                        .confidenceScore(aiResponseWithSession.getConfidenceScore())
                                        .sessionStatus(session.getStatus().name())
                                        .timestamp(LocalDateTime.now())
                                        .build();

                } catch (Exception e) {
                        log.error("Error processing AI message", e);
                        throw new RuntimeException("Failed to process AI message: " + e.getMessage());
                }
        }

        /**
         * Convert domain message to DTO
         */
        private AiChatResponse.MessageDto toMessageDto(AiMessage message) {
                String content = message.getContent();
                AiStructuredResponse structuredData = null;
                
                // If this is AI response with homestay data, create structured response
                if (message.isFromAi() && message.getMetadata() != null 
                    && message.getMetadata().containsKey("homestays")) {
                    try {
                        @SuppressWarnings("unchecked")
                        List<HomestayDocument> homestays = (List<HomestayDocument>) message.getMetadata().get("homestays");
                        String intent = (String) message.getMetadata().get("intent");
                        
                        structuredData = responseStructureService.structureResponse(
                            message.getContent(), 
                            intent, 
                            homestays
                        );
                        
                        // Remove content when we have structured data
                        content = null;
                        
                        log.info("Created structured response with {} data cards", 
                                structuredData.getData() != null ? structuredData.getData().size() : 0);
                    } catch (Exception e) {
                        log.warn("Failed to create structured response, fallback to plain text", e);
                    }
                }
                
                return AiChatResponse.MessageDto.builder()
                                .messageId(message.getMessageId())
                                .senderId(message.getSenderId())
                                .senderName(message.getSenderName())
                                .content(content)
                                .structuredData(structuredData)
                                .timestamp(message.getTimestamp())
                                .type(message.getType().name())
                                .build();
        }
}