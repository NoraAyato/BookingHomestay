package com.bookinghomestay.app.api.controller.chat;

import com.bookinghomestay.app.api.dto.common.ApiResponse;
import com.bookinghomestay.app.application.chat.ChatService;
import com.bookinghomestay.app.application.chat.dto.*;
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
 * REST API Controller cho chức năng Chat
 */
@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final FirebaseAuthService firebaseAuthService;

    /**
     * Tạo conversation mới hoặc lấy conversation đã tồn tại
     * 
     * Request body:
     * {
     * "hostId": "HOST456",
     * "homestayId": "HS789"
     * }
     * 
     * userId tự động lấy từ JWT token (SecurityContext)
     */
    @PostMapping("/conversations")
    public ResponseEntity<ApiResponse<CreateConversationResponse>> createConversation(
            @RequestBody CreateConversationRequest request) {

        // Lấy userId từ SecurityContext (đã được JwtAuthenticationFilter set)
        String userId = SecurityUtils.getCurrentUserId();
        request.setUserId(userId);

        log.info("📨 POST /api/chat/conversations - userId: {} (from SecurityContext), hostId: {}, homestayId: {}",
                userId, request.getHostId(), request.getHomestayId());

        CreateConversationResponse response = chatService.createOrGetConversation(request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Tạo conversation thành công", response));
    }

    /**
     * Gửi message vào conversation
     * 
     * Request body:
     * {
     * "conversationId": "USER123_HOST456_HS789",
     * "content": "Homestay này còn phòng không ạ?"
     * }
     * 
     * senderId tự động lấy từ JWT token
     */
    @PostMapping("/messages")
    public ResponseEntity<ApiResponse<SendMessageResponse>> sendMessage(
            @RequestBody SendMessageRequest request) {

        // Lấy senderId từ SecurityContext
        String senderId = SecurityUtils.getCurrentUserId();
        request.setSenderId(senderId);

        log.info("📨 POST /api/chat/messages - conversationId: {}, senderId: {} (from SecurityContext)",
                request.getConversationId(), senderId);

        SendMessageResponse response = chatService.sendMessage(request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Gửi message thành công", response));
    }

    /**
     * Lấy danh sách conversations của user hiện tại
     * 
     * userId tự động lấy từ JWT token
     */
    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<ConversationDto>>> getMyConversations() {

        String userId = SecurityUtils.getCurrentUserId();

        log.info("📨 GET /api/chat/conversations - userId: {} (from SecurityContext)", userId);

        List<ConversationDto> conversations = chatService.getUserConversations(userId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Lấy conversations thành công", conversations));
    }

    /**
     * Lấy Firebase Custom Token để Frontend authenticate với Firebase
     * 
     * userId tự động lấy từ JWT token
     * 
     * Response:
     * {
     * "success": true,
     * "message": "Lấy Firebase token thành công",
     * "data": {
     * "customToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
     * "userId": "USER123"
     * }
     * }
     */
    @GetMapping("/firebase-token")
    public ResponseEntity<ApiResponse<Map<String, String>>> getFirebaseToken() throws FirebaseAuthException {

        String userId = SecurityUtils.getCurrentUserId();

        log.info("📨 GET /api/chat/firebase-token - userId: {} (from SecurityContext)", userId);

        String customToken = firebaseAuthService.generateCustomToken(userId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Lấy Firebase token thành công",
                        Map.of("customToken", customToken, "userId", userId)));
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Chat service is running!", "🚀"));
    }
}