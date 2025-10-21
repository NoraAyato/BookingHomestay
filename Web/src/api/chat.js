import {
  database,
  auth,
  ref,
  onValue,
  signInWithCustomToken,
} from "./firebase";
import http from "./http";

/**
 * Lấy Firebase Custom Token từ backend và authenticate với Firebase
 * GET /api/chat/firebase-token
 */
export const authenticateFirebase = async () => {
  try {
    const response = await http.get("/api/chat/firebase-token", {
      requireAuth: true,
    });

    console.log("Firebase token response:", response); // Debug log

    if (response.success && response.data) {
      const { customToken, userId } = response.data;

      if (customToken) {
        // Sign in với Firebase using custom token - cần truyền auth object
        await signInWithCustomToken(auth, customToken);
        return { success: true, userId };
      }
    }

    return {
      success: false,
      message: response.message || "Không thể lấy Firebase token",
    };
  } catch (error) {
    console.error("Error authenticating with Firebase:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Tạo conversation mới hoặc lấy conversation đã tồn tại
 * POST /api/chat/conversations
 */
export const createOrGetConversation = async (hostId, homestayId) => {
  try {
    const response = await http.post(
      "/api/chat/conversations",
      {
        hostId,
        homestayId,
      },
      { requireAuth: true }
    );

    return response;
  } catch (error) {
    console.error("Error creating conversation:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Gửi message
 * POST /api/chat/messages
 */
export const sendMessage = async (conversationId, content) => {
  try {
    const response = await http.post(
      "/api/chat/messages",
      {
        conversationId,
        content,
      },
      { requireAuth: true }
    );

    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Lấy danh sách conversations của user hiện tại
 * GET /api/chat/conversations
 */
export const getMyConversations = async () => {
  try {
    const response = await http.get("/api/chat/conversations", {
      requireAuth: true,
    });

    return response;
  } catch (error) {
    console.error("Error getting conversations:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Lắng nghe messages realtime từ Firebase
 * conversationId format: "USER123_HOST456_HS789"
 */
export const listenToMessages = (conversationId, callback) => {
  if (!conversationId) return () => {};

  const messagesRef = ref(database, `messages/${conversationId}`);

  return onValue(messagesRef, (snapshot) => {
    const messages = [];
    snapshot.forEach((childSnapshot) => {
      messages.push({
        id: childSnapshot.key,
        ...childSnapshot.val(),
      });
    });

    // Sort by sentAt (hoặc timestamp nếu có)
    messages.sort((a, b) => {
      const timeA = a.sentAt || a.timestamp || 0;
      const timeB = b.sentAt || b.timestamp || 0;
      return timeA - timeB;
    });

    callback(messages);
  });
};

/**
 * Lắng nghe conversation metadata realtime từ Firebase
 */
export const listenToConversation = (conversationId, callback) => {
  if (!conversationId) return () => {};

  const conversationRef = ref(database, `conversations/${conversationId}`);

  return onValue(conversationRef, (snapshot) => {
    callback(snapshot.val());
  });
};

/**
 * Lắng nghe trạng thái online của user
 */
export const listenToUserPresence = (userId, callback) => {
  if (!userId) return () => {};

  const presenceRef = ref(database, `presence/${userId}`);

  return onValue(presenceRef, (snapshot) => {
    callback(snapshot.val());
  });
};
