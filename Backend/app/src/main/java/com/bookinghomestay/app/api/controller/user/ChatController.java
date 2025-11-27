package com.bookinghomestay.app.api.controller.user;

import com.bookinghomestay.app.application.chat.command.*;
import com.bookinghomestay.app.application.chat.query.*;
import com.bookinghomestay.app.application.chat.dto.*;
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

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

        private final CreateConversationCommandHandler createConversationHandler;
        private final SendMessageCommandHandler sendMessageHandler;
        private final GetUserConversationsQueryHandler getUserConversationsHandler;
        private final FirebaseAuthService firebaseAuthService;
        private final ChatService chatService; // ✅ Inject ChatService cho mark-as-read

        @PostMapping("/conversations")
        public ResponseEntity<ApiResponse<CreateConversationResponse>> createConversation(
                        @RequestBody CreateConversationRequest request) {

                // Lấy userId từ SecurityContext (đã được JwtAuthenticationFilter set)
                String userId = SecurityUtils.getCurrentUserId();
                request.setUserId(userId);

                // Tạo command và gọi handler
                CreateConversationCommand command = CreateConversationCommand.builder()
                                .userId(request.getUserId())
                                .hostId(request.getHostId())
                                .homestayId(request.getHomestayId())
                                .build();

                CreateConversationResponse response = createConversationHandler.handle(command);

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

                // Tạo command và gọi handler
                SendMessageCommand command = SendMessageCommand.builder()
                                .conversationId(request.getConversationId())
                                .senderId(request.getSenderId())
                                .content(request.getContent())
                                .build();

                SendMessageResponse response = sendMessageHandler.handle(command);

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

                // Tạo query và gọi handler
                GetUserConversationsQuery query = GetUserConversationsQuery.builder()
                                .userId(userId)
                                .build();

                List<ConversationDto> conversations = getUserConversationsHandler.handle(query);

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

                String customToken = firebaseAuthService.generateCustomToken(userId);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Lấy Firebase token thành công",
                                                Map.of("customToken", customToken, "userId", userId)));
        }

        /**
         * Mark tất cả messages trong conversation là đã đọc
         * 
         * Frontend gọi API này khi user mở/click vào conversation
         * 
         * @param conversationId ID của conversation
         */
        @PostMapping("/conversations/{conversationId}/mark-read")
        public ResponseEntity<ApiResponse<String>> markConversationAsRead(
                        @PathVariable String conversationId) {

                String userId = SecurityUtils.getCurrentUserId();

                // Gọi service để mark messages as read
                chatService.markMessagesAsRead(conversationId, userId);

                return ResponseEntity.ok(
                                new ApiResponse<>(true, "Đã đánh dấu tất cả tin nhắn là đã đọc", "OK"));
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