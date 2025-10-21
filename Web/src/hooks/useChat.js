import { useState, useEffect, useCallback } from "react";
import {
  authenticateFirebase,
  getMyConversations,
  listenToMessages,
  sendMessage as sendMessageApi,
  createOrGetConversation,
  listenToUserPresence,
} from "../api/chat";

/**
 * Hook để quản lý danh sách conversations
 */
export const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMyConversations();
      if (response.success) {
        setConversations(response.data || []);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    loading,
    error,
    reload: loadConversations,
  };
};

/**
 * Hook để quản lý messages realtime trong một conversation
 */
export const useMessages = (conversationId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Lắng nghe messages realtime từ Firebase
    const unsubscribe = listenToMessages(conversationId, (data) => {
      setMessages(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [conversationId]);

  const sendMessage = useCallback(
    async (content) => {
      if (!conversationId || !content.trim()) {
        return { success: false, message: "Invalid message" };
      }

      setSending(true);
      try {
        const response = await sendMessageApi(conversationId, content);
        setSending(false);
        return response;
      } catch (err) {
        setError(err.message);
        setSending(false);
        return { success: false, message: err.message };
      }
    },
    [conversationId]
  );

  return {
    messages,
    loading,
    error,
    sending,
    sendMessage,
  };
};

/**
 * Hook để quản lý chatbox với host
 */
export const useChatBox = (hostId, homestayId) => {
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFirebaseAuthenticated, setIsFirebaseAuthenticated] = useState(false);

  // Authenticate với Firebase khi component mount
  useEffect(() => {
    const initFirebase = async () => {
      const result = await authenticateFirebase();
      if (result.success) {
        setIsFirebaseAuthenticated(true);
        console.log("✅ Firebase authenticated successfully!");
      } else {
        console.error(
          "❌ Failed to authenticate with Firebase:",
          result.message
        );
      }
    };

    initFirebase();
  }, []);

  const initConversation = useCallback(async () => {
    if (!hostId || !homestayId) {
      return { success: false, message: "Missing hostId or homestayId" };
    }

    setLoading(true);
    try {
      const response = await createOrGetConversation(hostId, homestayId);
      if (response.success && response.data?.conversationId) {
        setConversationId(response.data.conversationId);
        return { success: true, conversationId: response.data.conversationId };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, [hostId, homestayId]);

  return {
    conversationId,
    loading,
    error,
    isFirebaseAuthenticated,
    initConversation,
  };
};

/**
 * Hook để lắng nghe trạng thái online của user
 */
export const useUserPresence = (userId) => {
  const [presence, setPresence] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = listenToUserPresence(userId, (data) => {
      setPresence(data);
    });

    return () => unsubscribe();
  }, [userId]);

  return presence;
};
