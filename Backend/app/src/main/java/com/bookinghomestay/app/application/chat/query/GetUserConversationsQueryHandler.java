package com.bookinghomestay.app.application.chat.query;

import com.bookinghomestay.app.application.chat.dto.ConversationDto;
import com.bookinghomestay.app.application.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GetUserConversationsQueryHandler {

    private final ChatService chatService;

    public List<ConversationDto> handle(GetUserConversationsQuery query) {
     
        // Validate query
        validateQuery(query);

        // Delegate to service
        return chatService.getUserConversations(query.getUserId());
    }

    private void validateQuery(GetUserConversationsQuery query) {
        if (query.getUserId() == null || query.getUserId().isEmpty()) {
            throw new IllegalArgumentException("UserId không được để trống");
        }
    }
}
