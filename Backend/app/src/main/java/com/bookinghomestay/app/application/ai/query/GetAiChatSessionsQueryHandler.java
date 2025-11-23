package com.bookinghomestay.app.application.ai.query;

import com.bookinghomestay.app.application.ai.dto.AiChatSessionsResponse;
import com.bookinghomestay.app.domain.model.ai.AiChatSession;
import com.bookinghomestay.app.domain.service.AiChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Handler to return user's recent AI chat sessions
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GetAiChatSessionsQueryHandler {

    private final AiChatService aiChatService;

    public AiChatSessionsResponse handle(GetAiChatSessionsQuery query) {
        try {
            log.info("Getting recent sessions for user {} limit {}", query.getUserId(), query.getLimitOrDefault());

            List<AiChatSession> sessions = aiChatService.getUserRecentSessions(query.getUserId(),
                    query.getLimitOrDefault());

            List<AiChatSessionsResponse.SessionDto> dtos = sessions.stream()
                    .map(s -> AiChatSessionsResponse.SessionDto.builder()
                            .sessionId(s.getSessionId())
                            .title(s.getCurrentIntent() != null ? s.getCurrentIntent() : "Cuộc trò chuyện")
                            .lastMessage("") // optionally fill from messages later
                            .lastActivityAt(s.getLastActivityAt())
                            .status(s.getStatus().name())
                            .unreadCount(0)
                            .userAvatar(s.getUserAvatar())
                            .build())
                    .collect(Collectors.toList());

            return AiChatSessionsResponse.builder()
                    .sessions(dtos)
                    .build();
        } catch (Exception e) {
            log.error("Error getting sessions for user {}", query.getUserId(), e);
            throw new RuntimeException("Failed to get sessions: " + e.getMessage());
        }
    }
}
