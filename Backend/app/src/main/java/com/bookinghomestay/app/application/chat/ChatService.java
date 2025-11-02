package com.bookinghomestay.app.application.chat;

import com.bookinghomestay.app.application.chat.dto.*;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.infrastructure.firebase.FirebaseDatabaseService;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaHomestayRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaUserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

/**
 * Service chính cho chức năng chat
 * 
 * Chức năng:
 * 1. Tạo/lấy conversation
 * 2. Gửi message vào Firebase
 * 3. Lấy danh sách conversations
 * 4. Sync metadata từ SQL → Firebase
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final FirebaseDatabaseService firebaseDatabaseService;
    private final JpaUserRepository userRepository;
    private final JpaHomestayRepository homestayRepository;

    /**
     * Generate conversation ID theo format: userId_hostId_homestayId
     * 
     * Conversation ID là deterministic → không cần query Firebase để check
     * 
     * @return conversationId string
     */
    public String generateConversationId(String userId, String hostId, String homestayId) {
        return userId + "_" + hostId + "_" + homestayId;
    }

    /**
     * Tạo conversation mới hoặc lấy conversation đã tồn tại
     * 
     * Logic:
     * 1. Generate conversationId
     * 2. Check xem conversation đã tồn tại trong Firebase chưa
     * 3. Nếu chưa → tạo mới và sync metadata từ SQL
     * 4. Nếu rồi → return thông tin conversation hiện tại
     * 
     * @param request CreateConversationRequest
     * @return CreateConversationResponse với đầy đủ metadata
     */
    public CreateConversationResponse createOrGetConversation(CreateConversationRequest request) {
        String userId = request.getUserId();
        String hostId = request.getHostId();
        String homestayId = request.getHomestayId();

        // Generate conversation ID
        String conversationId = generateConversationId(userId, hostId, homestayId);
        String conversationPath = "conversations/" + conversationId;

        try {
            // Check xem conversation đã tồn tại chưa
            CompletableFuture<Map<String, Object>> existingConversation = firebaseDatabaseService
                    .readData(conversationPath);

            Map<String, Object> conversationData = existingConversation.get();

            if (conversationData != null) {
                // Conversation đã tồn tại → return thông tin hiện tại
                log.info("📖 Conversation already exists: {}", conversationId);
                return mapToConversationResponse(conversationData);
            }

            // Conversation chưa tồn tại → tạo mới
            log.info("🆕 Creating new conversation: {}", conversationId);

            // Lấy thông tin từ SQL
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User không tồn tại: " + userId));
            User host = userRepository.findById(hostId)
                    .orElseThrow(() -> new RuntimeException("Host không tồn tại: " + hostId));
            Homestay homestay = homestayRepository.findById(homestayId)
                    .orElseThrow(() -> new RuntimeException("Homestay không tồn tại: " + homestayId));

            // Tạo conversation data với metadata đầy đủ
            Map<String, Object> newConversation = new HashMap<>();
            newConversation.put("conversationId", conversationId);
            newConversation.put("userId", userId);
            newConversation.put("userName", user.getUserName());
            newConversation.put("userAvatar", user.getPicture());
            newConversation.put("hostId", hostId);
            newConversation.put("hostName", host.getUserName());
            newConversation.put("hostAvatar", host.getPicture());
            newConversation.put("homestayId", homestayId);
            newConversation.put("homestayName", homestay.getTenHomestay());
            newConversation.put("homestayImage", homestay.getHinhAnh());
            newConversation.put("createdAt", System.currentTimeMillis());
            newConversation.put("lastMessage", "");
            newConversation.put("lastMessageAt", System.currentTimeMillis());
            newConversation.put("lastSenderId", "");
            newConversation.put("unreadCount", 0);

            // Ghi vào Firebase
            firebaseDatabaseService.writeData(conversationPath, newConversation);

            // Return response
            return CreateConversationResponse.builder()
                    .conversationId(conversationId)
                    .userId(userId)
                    .userName(user.getUserName())
                    .userAvatar(user.getPicture())
                    .hostId(hostId)
                    .hostName(host.getUserName())
                    .hostAvatar(host.getPicture())
                    .homestayId(homestayId)
                    .homestayName(homestay.getTenHomestay())
                    .homestayImage(homestay.getHinhAnh())
                    .createdAt(System.currentTimeMillis())
                    .build();

        } catch (InterruptedException | ExecutionException e) {
            log.error("❌ Error creating conversation: {}", e.getMessage());
            throw new RuntimeException("Lỗi tạo conversation", e);
        }
    }

    /**
     * Gửi message vào Firebase
     * 
     * Logic:
     * 1. Validate conversation tồn tại
     * 2. Validate senderId có quyền gửi message (phải là user hoặc host)
     * 3. Generate messageId
     * 4. Ghi message vào Firebase: messages/{conversationId}/{messageId}
     * 5. Update lastMessage trong conversation
     * 
     * @param request SendMessageRequest
     * @return SendMessageResponse
     */
    public SendMessageResponse sendMessage(SendMessageRequest request) {
        String conversationId = request.getConversationId();
        String senderId = request.getSenderId();
        String content = request.getContent();

        try {
            // Validate conversation tồn tại
            String conversationPath = "conversations/" + conversationId;
            CompletableFuture<Map<String, Object>> conversationFuture = firebaseDatabaseService
                    .readData(conversationPath);
            Map<String, Object> conversation = conversationFuture.get();

            if (conversation == null) {
                throw new RuntimeException("Conversation không tồn tại: " + conversationId);
            }

            // Validate senderId (phải là userId hoặc hostId trong conversation)
            String userId = (String) conversation.get("userId");
            String hostId = (String) conversation.get("hostId");

            if (!senderId.equals(userId) && !senderId.equals(hostId)) {
                throw new RuntimeException("User không có quyền gửi message trong conversation này");
            }

            // Lấy thông tin sender
            User sender = userRepository.findById(senderId)
                    .orElseThrow(() -> new RuntimeException("Sender không tồn tại: " + senderId));

            // Generate message ID
            String messageId = "msg_" + UUID.randomUUID().toString().replace("-", "");
            long sentAt = System.currentTimeMillis();

            // Tạo message data
            Map<String, Object> message = new HashMap<>();
            message.put("messageId", messageId);
            message.put("senderId", senderId);
            message.put("senderName", sender.getUserName());
            message.put("senderAvatar", sender.getPicture());
            message.put("content", content);
            message.put("sentAt", sentAt);
            message.put("isRead", false);

            // Ghi message vào Firebase
            String messagePath = "messages/" + conversationId + "/" + messageId;
            firebaseDatabaseService.writeData(messagePath, message);

            // Update lastMessage trong conversation
            Map<String, Object> conversationUpdates = new HashMap<>();
            conversationUpdates.put("lastMessage", content);
            conversationUpdates.put("lastMessageAt", sentAt);
            conversationUpdates.put("lastSenderId", senderId);
            firebaseDatabaseService.updateData(conversationPath, conversationUpdates);

            log.info("✅ Message sent: {} in conversation: {}", messageId, conversationId);

            // Return response
            return SendMessageResponse.builder()
                    .messageId(messageId)
                    .conversationId(conversationId)
                    .senderId(senderId)
                    .senderName(sender.getUserName())
                    .content(content)
                    .sentAt(sentAt)
                    .build();

        } catch (InterruptedException | ExecutionException e) {
            log.error("❌ Error sending message: {}", e.getMessage());
            throw new RuntimeException("Lỗi gửi message", e);
        }
    }

    /**
     * Lấy danh sách conversations của user
     * 
     * Note: Đây là implementation đơn giản
     * Trong thực tế, nên dùng Firebase Query để filter hiệu quả hơn
     * 
     * @param userId ID của user
     * @return List conversations
     */
    public List<ConversationDto> getUserConversations(String userId) {
        // TODO: Implement Firebase query để filter conversations theo userId
        // Hiện tại return empty list, Frontend sẽ listen trực tiếp từ Firebase
        log.warn("⚠️ getUserConversations chưa implement - Frontend nên listen trực tiếp từ Firebase");
        return new ArrayList<>();
    }

    /**
     * Helper method: Map Firebase data → CreateConversationResponse
     */
    private CreateConversationResponse mapToConversationResponse(Map<String, Object> data) {
        return CreateConversationResponse.builder()
                .conversationId((String) data.get("conversationId"))
                .userId((String) data.get("userId"))
                .userName((String) data.get("userName"))
                .userAvatar((String) data.get("userAvatar"))
                .hostId((String) data.get("hostId"))
                .hostName((String) data.get("hostName"))
                .hostAvatar((String) data.get("hostAvatar"))
                .homestayId((String) data.get("homestayId"))
                .homestayName((String) data.get("homestayName"))
                .homestayImage((String) data.get("homestayImage"))
                .createdAt((Long) data.get("createdAt"))
                .build();
    }
}
