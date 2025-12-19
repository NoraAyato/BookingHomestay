package com.bookinghomestay.app.api.controller.host;

import com.bookinghomestay.app.application.chat.command.CreateConversationAsHostCommand;
import com.bookinghomestay.app.application.chat.command.CreateConversationAsHostCommandHandler;
import com.bookinghomestay.app.application.chat.command.SendMessageCommand;
import com.bookinghomestay.app.application.chat.command.SendMessageCommandHandler;
import com.bookinghomestay.app.application.chat.dto.CreateConversationAsHostRequest;
import com.bookinghomestay.app.application.chat.dto.CreateConversationResponse;
import com.bookinghomestay.app.application.chat.dto.SendMessageRequest;
import com.bookinghomestay.app.application.chat.dto.SendMessageResponse;
import com.bookinghomestay.app.application.chat.dto.ConversationDto;
import com.bookinghomestay.app.application.chat.query.GetUserConversationsQuery;
import com.bookinghomestay.app.application.chat.query.GetUserConversationsQueryHandler;
import com.bookinghomestay.app.application.chat.service.ChatService;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.infrastructure.firebase.FirebaseAuthService;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;
import com.google.firebase.auth.FirebaseAuthException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Chat API riêng cho Host
 * Tránh nhầm lẫn userId/hostId khi Host muốn nhắn tin với Customer
 */
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
