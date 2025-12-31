package com.bookinghomestay.app.api.controller.host;

import com.bookinghomestay.app.application.chat.command.CreateConversationAsHostCommand;
import com.bookinghomestay.app.application.chat.command.CreateConversationAsHostCommandHandler;
import com.bookinghomestay.app.application.chat.dto.CreateConversationAsHostRequest;
import com.bookinghomestay.app.application.chat.dto.CreateConversationResponse;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/host/chat")
@RequiredArgsConstructor
public class HostChatController {

    private final CreateConversationAsHostCommandHandler createConversationAsHostHandler;

    @PostMapping("/conversations")
    public ResponseEntity<ApiResponse<CreateConversationResponse>> createConversationWithCustomer(
            @RequestBody CreateConversationAsHostRequest request) {
        String hostId = SecurityUtils.getCurrentUserId();
        CreateConversationAsHostCommand command = CreateConversationAsHostCommand.builder()
                .hostId(hostId)
                .customerId(request.getCustomerId())
                .homestayId(request.getHomestayId())
                .build();
        CreateConversationResponse response = createConversationAsHostHandler.handle(command);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Tạo conversation thành công", response));
    }
}
