package com.bookinghomestay.app.application.chat.command;

import com.bookinghomestay.app.application.chat.dto.CreateConversationRequest;
import com.bookinghomestay.app.application.chat.dto.CreateConversationResponse;
import com.bookinghomestay.app.application.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CreateConversationCommandHandler {

    private final ChatService chatService;

    public CreateConversationResponse handle(CreateConversationCommand command) {
      
        // Validate command
        validateCommand(command);

        // Convert command → request DTO
        CreateConversationRequest request = CreateConversationRequest.builder()
                .userId(command.getUserId())
                .hostId(command.getHostId())
                .homestayId(command.getHomestayId())
                .build();

        // Delegate to service
        return chatService.createOrGetConversation(request);
    }

    private void validateCommand(CreateConversationCommand command) {
        if (command.getUserId() == null || command.getUserId().isEmpty()) {
            throw new IllegalArgumentException("UserId không được để trống");
        }
        if (command.getHostId() == null || command.getHostId().isEmpty()) {
            throw new IllegalArgumentException("HostId không được để trống");
        }
        if (command.getHomestayId() == null || command.getHomestayId().isEmpty()) {
            throw new IllegalArgumentException("HomestayId không được để trống");
        }
    }
}
