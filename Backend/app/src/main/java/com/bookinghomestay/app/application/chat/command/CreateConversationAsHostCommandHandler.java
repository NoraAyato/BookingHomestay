package com.bookinghomestay.app.application.chat.command;

import com.bookinghomestay.app.application.chat.dto.CreateConversationRequest;
import com.bookinghomestay.app.application.chat.dto.CreateConversationResponse;
import com.bookinghomestay.app.application.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Handler for Host creating conversation with Customer
 * Đảm bảo đúng thứ tự: userId (customer) và hostId (host)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CreateConversationAsHostCommandHandler {

    private final ChatService chatService;

    public CreateConversationResponse handle(CreateConversationAsHostCommand command) {

        // Validate command
        validateCommand(command);

        // Convert command → request DTO với đúng thứ tự
        // userId = customerId (người thuê)
        // hostId = hostId (chủ nhà)
        CreateConversationRequest request = CreateConversationRequest.builder()
                .userId(command.getCustomerId()) // ✅ Customer = userId
                .hostId(command.getHostId()) // ✅ Host = hostId
                .homestayId(command.getHomestayId())
                .build();

        log.info("🏠 Host {} creating conversation with Customer {} for Homestay {}",
                command.getHostId(), command.getCustomerId(), command.getHomestayId());

        // Delegate to service
        return chatService.createOrGetConversation(request);
    }

    private void validateCommand(CreateConversationAsHostCommand command) {
        if (command.getHostId() == null || command.getHostId().isEmpty()) {
            throw new IllegalArgumentException("HostId không được để trống");
        }
        if (command.getCustomerId() == null || command.getCustomerId().isEmpty()) {
            throw new IllegalArgumentException("CustomerId không được để trống");
        }
        if (command.getHomestayId() == null || command.getHomestayId().isEmpty()) {
            throw new IllegalArgumentException("HomestayId không được để trống");
        }
        if (command.getHostId().equals(command.getCustomerId())) {
            throw new IllegalArgumentException("Host không thể nhắn tin cho chính mình");
        }
    }
}
