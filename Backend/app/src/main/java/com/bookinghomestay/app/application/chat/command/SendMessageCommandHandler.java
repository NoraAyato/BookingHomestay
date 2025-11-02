package com.bookinghomestay.app.application.chat.command;

import com.bookinghomestay.app.application.chat.dto.SendMessageRequest;
import com.bookinghomestay.app.application.chat.dto.SendMessageResponse;
import com.bookinghomestay.app.application.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@Slf4j
@Service
@RequiredArgsConstructor
public class SendMessageCommandHandler {

    private final ChatService chatService;

    public SendMessageResponse handle(SendMessageCommand command) {
      
        // Validate command
        validateCommand(command);

        // Convert command → request DTO
        SendMessageRequest request = SendMessageRequest.builder()
                .conversationId(command.getConversationId())
                .senderId(command.getSenderId())
                .content(command.getContent())
                .build();

        // Delegate to service
        return chatService.sendMessage(request);
    }

    private void validateCommand(SendMessageCommand command) {
        if (command.getConversationId() == null || command.getConversationId().isEmpty()) {
            throw new IllegalArgumentException("ConversationId không được để trống");
        }
        if (command.getSenderId() == null || command.getSenderId().isEmpty()) {
            throw new IllegalArgumentException("SenderId không được để trống");
        }
        if (command.getContent() == null || command.getContent().isEmpty()) {
            throw new IllegalArgumentException("Content không được để trống");
        }
    }
}
