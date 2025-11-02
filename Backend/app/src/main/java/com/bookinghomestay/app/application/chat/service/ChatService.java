package com.bookinghomestay.app.application.chat.service;

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
     * Tạo hoặc lấy conversation hiện có
     * 
     * Logic:
     * 1. Generate conversationId
     * 2. Check conversation đã tồn tại trong Firebase chưa
     * 3. Nếu chưa → Tạo mới với metadata từ PostgreSQL
     * 4. Nếu có → Mark as read tất cả messages của đối phương
     * 5. Return conversation info
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

                // Mark as read tất cả messages mà đối phương gửi cho user này (ĐỢI hoàn thành)
                markMessagesAsRead(conversationId, userId);

                return mapToConversationResponse(conversationData);
            }

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
            newConversation.put("unreadCountForUser", 0);
            newConversation.put("unreadCountForHost", 0);

            // Ghi vào Firebase (đợi hoàn thành)
            firebaseDatabaseService.writeData(conversationPath, newConversation).get();

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

            // Ghi message vào Firebase (đợi hoàn thành)
            String messagePath = "messages/" + conversationId + "/" + messageId;
            firebaseDatabaseService.writeData(messagePath, message).get();

            // Tăng unreadCount cho người nhận
            // Nếu senderId = userId → User gửi → Tăng unreadCountForHost
            // Nếu senderId = hostId → Host gửi → Tăng unreadCountForUser
            Map<String, Object> conversationUpdates = new HashMap<>();
            conversationUpdates.put("lastMessage", content);
            conversationUpdates.put("lastMessageAt", sentAt);
            conversationUpdates.put("lastSenderId", senderId);

            if (senderId.equals(userId)) {
                // User gửi message → Tăng unreadCountForHost
                int currentCount = getIntValue(conversation.get("unreadCountForHost"));
                conversationUpdates.put("unreadCountForHost", currentCount + 1);

            } else {
                // Host gửi message → Tăng unreadCountForUser
                int currentCount = getIntValue(conversation.get("unreadCountForUser"));
                conversationUpdates.put("unreadCountForUser", currentCount + 1);

            }

            // Update conversation (đợi hoàn thành)
            firebaseDatabaseService.updateData(conversationPath, conversationUpdates).get();

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
            throw new RuntimeException("Lỗi gửi message", e);
        }
    }

    /**
     * Lấy danh sách conversations của user
     * 
     * Logic:
     * 1. Query tất cả conversations từ Firebase
     * 2. Filter conversations mà user là participant (userId hoặc hostId)
     * 3. Sort theo lastMessageAt (mới nhất trước)
     * 4. Map to ConversationDto
     * 
     * @param userId ID của user
     * @return List conversations
     */
    public List<ConversationDto> getUserConversations(String userId) {
        try {

            // Query all conversations from Firebase
            CompletableFuture<Map<String, Object>> conversationsFuture = firebaseDatabaseService
                    .readData("conversations");

            Map<String, Object> allConversations = conversationsFuture.get();

            if (allConversations == null || allConversations.isEmpty()) {
                return new ArrayList<>();
            }

            // Filter conversations where user is participant (userId or hostId)
            List<ConversationDto> userConversations = new ArrayList<>();

            for (Map.Entry<String, Object> entry : allConversations.entrySet()) {
                @SuppressWarnings("unchecked")
                Map<String, Object> conversationData = (Map<String, Object>) entry.getValue();

                String conversationUserId = (String) conversationData.get("userId");
                String conversationHostId = (String) conversationData.get("hostId");

                // Check if current user is participant
                if (userId.equals(conversationUserId) || userId.equals(conversationHostId)) {
                    ConversationDto dto = mapToConversationDto(conversationData);
                    userConversations.add(dto);
                }
            }

            // Sort by lastMessageAt (descending - mới nhất trước)
            userConversations.sort((c1, c2) -> Long.compare(c2.getLastMessageAt(), c1.getLastMessageAt()));

            return userConversations;

        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Lỗi lấy danh sách conversations", e);
        }
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

    /**
     * Helper method: Map Firebase data → ConversationDto
     */
    private ConversationDto mapToConversationDto(Map<String, Object> data) {
        return ConversationDto.builder()
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
                .lastMessage((String) data.get("lastMessage"))
                .lastMessageAt(getLongValue(data.get("lastMessageAt")))
                .lastSenderId((String) data.get("lastSenderId"))
                .unreadCountForUser(getIntValue(data.get("unreadCountForUser")))
                .unreadCountForHost(getIntValue(data.get("unreadCountForHost")))
                .build();
    }

    /**
     * Helper method: Safely convert Object to Long
     */
    private Long getLongValue(Object value) {
        if (value == null) {
            return 0L;
        }
        if (value instanceof Long) {
            return (Long) value;
        }
        if (value instanceof Integer) {
            return ((Integer) value).longValue();
        }
        if (value instanceof String) {
            try {
                return Long.parseLong((String) value);
            } catch (NumberFormatException e) {
                return 0L;
            }
        }
        return 0L;
    }

    /**
     * Helper method: Safely convert Object to Integer
     */
    private Integer getIntValue(Object value) {
        if (value == null) {
            return 0;
        }
        if (value instanceof Integer) {
            return (Integer) value;
        }
        if (value instanceof Long) {
            return ((Long) value).intValue();
        }
        if (value instanceof String) {
            try {
                return Integer.parseInt((String) value);
            } catch (NumberFormatException e) {
                return 0;
            }
        }
        return 0;
    }

    /**
     * Mark tất cả messages của đối phương là đã đọc
     * 
     * Logic:
     * 1. Query tất cả messages trong conversation
     * 2. Filter messages mà senderId != currentUserId (messages của đối phương)
     * 3. Update isRead = true cho từng message
     * 4. ✅ ĐỢI tất cả updates hoàn thành trước khi return
     * 5. ✅ THROW exception nếu có lỗi (không catch silent)
     * 
     * ⚠️ PUBLIC method - được gọi từ Controller khi user mở conversation
     * 
     * @param conversationId ID của conversation
     * @param currentUserId  ID của user hiện tại (đang mở conversation)
     * @throws RuntimeException nếu có lỗi khi mark messages
     */
    public void markMessagesAsRead(String conversationId, String currentUserId) {
        try {

            // Query all messages trong conversation
            String messagesPath = "messages/" + conversationId;
            CompletableFuture<Map<String, Object>> messagesFuture = firebaseDatabaseService
                    .readData(messagesPath);

            Map<String, Object> allMessages = messagesFuture.get();

            if (allMessages == null || allMessages.isEmpty()) {
                return;
            }

            // Collect tất cả update futures để đợi hoàn thành
            List<CompletableFuture<Void>> updateFutures = new ArrayList<>();
            int messagesToMark = 0;

            // Loop qua tất cả messages
            for (Map.Entry<String, Object> entry : allMessages.entrySet()) {
                String messageId = entry.getKey();

                @SuppressWarnings("unchecked")
                Map<String, Object> messageData = (Map<String, Object>) entry.getValue();

                String senderId = (String) messageData.get("senderId");
                Object isReadObj = messageData.get("isRead");
                boolean isRead = isReadObj instanceof Boolean ? (Boolean) isReadObj : false;

                // Chỉ mark as read nếu:
                // 1. Message KHÔNG phải của currentUser (senderId != currentUserId)
                // 2. Message chưa được đọc (isRead == false)
                if (!currentUserId.equals(senderId) && !isRead) {
                    String messagePath = messagesPath + "/" + messageId;
                    Map<String, Object> updates = new HashMap<>();
                    updates.put("isRead", true);
                    updates.put("readAt", System.currentTimeMillis());

                    log.info("📝 Marking message {} as read (senderId: {})", messageId, senderId);

                    // Add update future vào list
                    CompletableFuture<Void> updateFuture = firebaseDatabaseService.updateData(messagePath, updates);
                    updateFutures.add(updateFuture);
                    messagesToMark++;
                }
            }

            if (!updateFutures.isEmpty()) {
                // ✅ ĐỢI tất cả updates hoàn thành
                CompletableFuture<Void> allUpdates = CompletableFuture.allOf(
                        updateFutures.toArray(new CompletableFuture[0]));
                allUpdates.get(); // Block cho đến khi tất cả updates hoàn thành

            } else {
            }

            // Reset unreadCount về 0 cho người đang mở conversation
            String conversationPath = "conversations/" + conversationId;
            CompletableFuture<Map<String, Object>> convFuture = firebaseDatabaseService
                    .readData(conversationPath);
            Map<String, Object> conv = convFuture.get();

            if (conv != null) {
                String convUserId = (String) conv.get("userId");
                String convHostId = (String) conv.get("hostId");

                Map<String, Object> unreadUpdates = new HashMap<>();
                if (currentUserId.equals(convUserId)) {
                    // User mở conversation → Reset unreadCountForUser
                    unreadUpdates.put("unreadCountForUser", 0);

                } else if (currentUserId.equals(convHostId)) {
                    // Host mở conversation → Reset unreadCountForHost
                    unreadUpdates.put("unreadCountForHost", 0);

                }

                if (!unreadUpdates.isEmpty()) {
                    firebaseDatabaseService.updateData(conversationPath, unreadUpdates).get();
                }
            }

        } catch (InterruptedException | ExecutionException e) {

            throw new RuntimeException("Lỗi mark messages as read: " + e.getMessage(), e);
        }
    }
}
