import { useState, useCallback, useRef } from "react";
import {
  chatWithAI,
  getAllAIChatSessions,
  getAIChatHistory,
} from "../api/chat";

/**
 * Hook chuyên dụng để quản lý AI Chat
 */
export const useAIChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false); // Riêng cho việc gửi tin nhắn
  const [error, setError] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [initError, setInitError] = useState(false);

  // ⭐ FIX: Thêm ref để tránh multiple initialization calls
  const initializingRef = useRef(false);

  // Pagination state
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalMessages, setTotalMessages] = useState(0);

  // Khởi tạo AI chat - gọi khi mở chat
  const initializeChat = useCallback(async () => {
    // ⭐ FIX: Kiểm tra cả initialized và initializingRef
    if (initialized || initializingRef.current) return;

    initializingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      // 1. Gọi API sessions để kiểm tra session hiện tại
      const sessionsResponse = await getAllAIChatSessions();

      if (
        sessionsResponse.success &&
        sessionsResponse.data?.sessions?.length > 0
      ) {
        // ⭐ Chỉ lấy session ACTIVE, không lấy EXPIRED
        const activeSessions = sessionsResponse.data.sessions.filter(
          (session) => session.status === "ACTIVE"
        );

        if (activeSessions.length > 0) {
          // Có session ACTIVE - lấy session gần nhất (sắp xếp theo lastActivityAt)
          const latestActiveSession = activeSessions.sort(
            (a, b) =>
              new Date(b.lastActivityAt).getTime() -
              new Date(a.lastActivityAt).getTime()
          )[0];

          setCurrentSessionId(latestActiveSession.sessionId);

          console.log(
            "✅ Found ACTIVE session:",
            latestActiveSession.sessionId
          );
          setCurrentSessionId(latestActiveSession.sessionId);

          // Gọi API lấy lịch sử
          const response = await getAIChatHistory(
            latestActiveSession.sessionId,
            0,
            20
          );

          if (response.success && response.data?.messages) {
            const messagesData = response.data.messages;
            const items = messagesData.items || [];
            const total = messagesData.total || 0;
            const limit = messagesData.limit || 20;

            // 🔍 Debug: Log raw message từ API
            console.log("🔍 Raw messages from API:", items.slice(0, 2));

            // Format messages
            const formattedMessages = items.map((msg) => ({
              id: msg.messageId,
              content: msg.content,
              structuredData: msg.structuredData, // ⭐ Support structuredData từ API
              isUser: msg.senderId !== "ai-assistant",
              timestamp: msg.timestamp,
              senderId: msg.senderId,
              senderName: msg.senderName,
              type: msg.type,
            }));

            const sortedMessages = [...formattedMessages].reverse();

            setMessages(sortedMessages);
            setTotalMessages(total);
            setCurrentPage(0);

            // Kiểm tra còn messages cũ hơn không: nếu đã load < total thì còn
            const loadedCount = items.length; // Page 0 đã load bao nhiêu messages
            const hasMore = loadedCount < total;
            setHasMoreMessages(hasMore);
          }
        } else {
          // Không có session ACTIVE - tạo mới
          const response = await chatWithAI("Hi");
          if (response.success && response.data) {
            setCurrentSessionId(response.data.sessionId);

            // Thêm cả user message và AI response
            const userMsg = {
              id: response.data.userMessage?.messageId || Date.now(),
              content: response.data.userMessage?.content || "Hi",
              isUser: true,
              timestamp: response.data.userMessage?.timestamp,
              senderId: response.data.userMessage?.senderId,
              senderName: response.data.userMessage?.senderName,
              type: response.data.userMessage?.type,
            };

            const aiMsg = {
              id: response.data.aiResponse?.messageId || Date.now() + 1,
              content: response.data.aiResponse?.content,
              isUser: false,
              timestamp: response.data.aiResponse?.timestamp,
              senderId: response.data.aiResponse?.senderId,
              senderName: response.data.aiResponse?.senderName,
              type: response.data.aiResponse?.type,
            };

            setMessages([userMsg, aiMsg]);
            setCurrentPage(0);
            setTotalMessages(2);
            setHasMoreMessages(false);
          }
        }
      } else {
        // Không có session - gọi API /send với message "Hi"
        const response = await chatWithAI("Hi");
        if (response.success && response.data) {
          setCurrentSessionId(response.data.sessionId);

          // Thêm cả user message và AI response
          const userMsg = {
            id: response.data.userMessage?.messageId || Date.now(),
            content: response.data.userMessage?.content || "Hi",
            isUser: true,
            timestamp: response.data.userMessage?.timestamp,
            senderId: response.data.userMessage?.senderId,
            senderName: response.data.userMessage?.senderName,
            type: response.data.userMessage?.type,
          };

          const aiMsg = {
            id: response.data.aiResponse?.messageId || Date.now() + 1,
            content: response.data.aiResponse?.content,
            isUser: false,
            timestamp: response.data.aiResponse?.timestamp,
            senderId: response.data.aiResponse?.senderId,
            senderName: response.data.aiResponse?.senderName,
            type: response.data.aiResponse?.type,
          };

          setMessages([userMsg, aiMsg]);
          setCurrentPage(0);
          setTotalMessages(2);
          setHasMoreMessages(false);
        }
      }

      setInitialized(true);
    } catch (err) {
      console.error("Error initializing AI chat:", err);
      setError(err.message);
      setInitError(true);
      // Vẫn cho phép chat ngay cả khi init failed
      setInitialized(true);
    } finally {
      setLoading(false);
      // ⭐ FIX: Reset initializingRef sau khi hoàn thành
      initializingRef.current = false;
    }
  }, [initialized]);

  const sendMessage = useCallback(
    async (message) => {
      if (!message.trim()) {
        return { success: false, message: "Tin nhắn không được để trống" };
      }

      // ⭐ FIX: Prevent double sending - check if already sending
      if (isSending) {
        console.warn("⚠️ Already sending a message, ignoring duplicate call");
        return {
          success: false,
          message: "Đang gửi tin nhắn, vui lòng đợi...",
        };
      }

      setIsSending(true);
      setError(null);

      // 1. Thêm tin nhắn của user ngay lập tức
      const tempUserMsgId = `user_${Date.now()}`;
      const userMsg = {
        id: tempUserMsgId,
        content: message,
        isUser: true,
        timestamp: new Date().toISOString(),
        senderId: "current_user",
        senderName: "Bạn",
        type: "USER_TEXT",
      };

      // 2. Thêm tin nhắn "Đang suy nghĩ..." của AI
      const tempAiMsgId = `ai_thinking_${Date.now()}`;
      const thinkingMsg = {
        id: tempAiMsgId,
        content: "Đang suy nghĩ...",
        isUser: false,
        timestamp: new Date().toISOString(),
        senderId: "ai-assistant",
        senderName: "Trợ lý AI",
        type: "AI_THINKING",
        isThinking: true,
      };

      // Lưu state cũ để rollback nếu cần
      const previousMessages = messages;

      setMessages((prev) => [...prev, userMsg, thinkingMsg]);

      try {
        const response = await chatWithAI(message, currentSessionId);

        if (response.success && response.data) {
          // 3. Cập nhật tin nhắn user với dữ liệu thật từ API
          const realUserMsg = {
            id: response.data.userMessage?.messageId || tempUserMsgId,
            content: response.data.userMessage?.content || message,
            isUser: true,
            timestamp:
              response.data.userMessage?.timestamp || new Date().toISOString(),
            senderId: response.data.userMessage?.senderId || "current_user",
            senderName: response.data.userMessage?.senderName || "Bạn",
            type: response.data.userMessage?.type || "USER_TEXT",
          };

          // 4. Thay thế tin nhắn "Đang suy nghĩ..." bằng phản hồi thật của AI
          const aiResponseData = response.data.aiResponse;
          const realAiMsg = {
            id: aiResponseData?.messageId || Date.now() + 1,
            content: aiResponseData?.content, // Text content (có thể undefined)
            structuredData: aiResponseData?.structuredData, // Structured data (có thể undefined)
            isUser: false,
            timestamp: aiResponseData?.timestamp || new Date().toISOString(),
            senderId: aiResponseData?.senderId || "ai-assistant",
            senderName: aiResponseData?.senderName || "Trợ lý AI",
            type: aiResponseData?.type || "AI_RESPONSE",
          };

          // ⭐ FIX: Xóa temp messages và thêm real messages
          setMessages((prev) => {
            // Lọc bỏ temp messages
            const withoutTempMessages = prev.filter(
              (msg) => msg.id !== tempUserMsgId && msg.id !== tempAiMsgId
            );

            // Thêm real messages vào cuối (giữ đúng thứ tự)
            return [...withoutTempMessages, realUserMsg, realAiMsg];
          });

          // Cập nhật totalMessages
          setTotalMessages((prev) => prev + 2);

          // Cập nhật sessionId nếu có
          if (response.data.sessionId && !currentSessionId) {
            setCurrentSessionId(response.data.sessionId);
          }

          return {
            success: true,
            sessionId: response.data.sessionId || currentSessionId,
            userMessage: realUserMsg,
            aiMessage: realAiMsg,
          };
        } else {
          // ⭐ FIX: Rollback về state cũ thay vì xóa messages
          setMessages(previousMessages);
          const errorMsg = response.message || "Không thể gửi tin nhắn";
          setError(errorMsg);
          return { success: false, message: errorMsg };
        }
      } catch (err) {
        // ⭐ FIX: Rollback về state cũ + log error để debug
        console.error("💥 Exception when sending AI message:", err);
        setMessages(previousMessages);
        const errorMsg = err.message || "Lỗi kết nối. Vui lòng thử lại.";
        setError(errorMsg);
        return { success: false, message: errorMsg };
      } finally {
        setIsSending(false);
      }
    },
    [currentSessionId, messages, isSending] // ⭐ FIX: Thêm isSending vào dependencies
  );

  const loadMoreMessages = useCallback(async () => {
    // Kiểm tra các điều kiện trước khi load
    if (!currentSessionId) {
      return { success: false, message: "No session ID" };
    }

    if (!hasMoreMessages) {
      return { success: false, message: "No more messages" };
    }

    if (loadingMore) {
      return { success: false, message: "Already loading" };
    }

    // Kiểm tra đã load đủ messages chưa
    if (totalMessages > 0 && messages.length >= totalMessages) {
      setHasMoreMessages(false);
      return { success: false, message: "All messages already loaded" };
    }

    setLoadingMore(true);
    try {
      // Load page tiếp theo (page + 1) - messages cũ hơn
      const nextPage = currentPage + 1;

      // Gọi API
      const response = await getAIChatHistory(currentSessionId, nextPage, 20);

      if (response.success && response.data?.messages?.items) {
        const messagesData = response.data.messages;
        const newMessages = messagesData.items || [];
        const total = messagesData.total || totalMessages;

        // Nếu không có messages mới, dừng lại
        if (newMessages.length === 0) {
          setHasMoreMessages(false);
          return { success: false, message: "No more messages" };
        }

        // Format messages
        const formattedMessages = newMessages.map((msg) => ({
          id: msg.messageId,
          content: msg.content,
          structuredData: msg.structuredData, // ⭐ Support structuredData từ API
          isUser: msg.senderId !== "ai-assistant",
          timestamp: msg.timestamp,
          senderId: msg.senderId,
          senderName: msg.senderName,
          type: msg.type,
        }));

        // Backend trả về: MỚI → CŨ, reverse để có CŨ → MỚI
        const sortedMessages = [...formattedMessages].reverse();

        // Nếu không có messages, dừng lại
        if (!sortedMessages || sortedMessages.length === 0) {
          setHasMoreMessages(false);
          return { success: false, message: "No more messages" };
        }

        // Thêm messages cũ hơn (page + 1) vào ĐẦU danh sách
        // Lọc bỏ các message đã tồn tại để tránh duplicate keys
        setMessages((prev) => {
          const existingIds = new Set(prev.map((msg) => msg.id));
          const newUniqueMessages = sortedMessages.filter(
            (msg) => !existingIds.has(msg.id)
          );
          return [...newUniqueMessages, ...prev];
        });

        // Update pagination state
        setCurrentPage(nextPage);
        setTotalMessages(total);

        // Tính tổng số messages đã load (bao gồm cả messages mới vừa thêm)
        const currentTotalLoaded = messages.length + sortedMessages.length;
        const hasMore = currentTotalLoaded < total;

        setHasMoreMessages(hasMore);

        return {
          success: true,
          loadedCount: sortedMessages.length,
          hasMore: hasMore,
          totalLoaded: currentTotalLoaded,
          total: total,
        };
      } else {
        return { success: false, message: "Failed to load messages" };
      }
    } catch (err) {
      console.error("Error loading more messages:", err);
      return { success: false, message: err.message };
    } finally {
      setLoadingMore(false);
    }
  }, [
    currentSessionId,
    hasMoreMessages,
    loadingMore,
    currentPage,
    messages.length,
    totalMessages,
  ]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentSessionId(null);
    setInitialized(false);
    setHasMoreMessages(true);
    setCurrentPage(0);
    setTotalMessages(0);
  }, [currentSessionId]);

  return {
    messages,
    loading,
    isSending,
    error,
    sessionId: currentSessionId,
    initialized,
    initError,
    initializeChat,
    sendMessage,
    clearMessages,
    // Pagination
    hasMoreMessages,
    loadingMore,
    totalMessages,
    loadMoreMessages,
  };
};

/**
 * Hook để quản lý AI chat sessions
 */
export const useAIChatSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllAIChatSessions();
      if (response.success) {
        const allSessions = response.data?.sessions || [];

        // ⭐ Sắp xếp: ACTIVE trước, sau đó theo lastActivityAt
        const sortedSessions = allSessions.sort((a, b) => {
          // ACTIVE sessions đi trước
          if (a.status === "ACTIVE" && b.status !== "ACTIVE") return -1;
          if (a.status !== "ACTIVE" && b.status === "ACTIVE") return 1;

          // Cùng status thì sắp xếp theo thời gian
          return (
            new Date(b.lastActivityAt).getTime() -
            new Date(a.lastActivityAt).getTime()
          );
        });

        setSessions(sortedSessions);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sessions,
    loading,
    error,
    loadSessions,
    reload: loadSessions,
  };
};

/**
 * Hook để quản lý AI chat history cho một session cụ thể
 */
export const useAIChatHistory = (sessionId) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const loadHistory = useCallback(
    async (pageNum = 0, reset = false) => {
      if (!sessionId) return;

      setLoading(true);
      setError(null);
      try {
        const response = await getAIChatHistory(sessionId, pageNum, 20);
        if (response.success) {
          const messagesData = response.data?.messages;
          const newMessages = messagesData?.items || [];
          const totalCount = messagesData?.total || 0;

          // Format messages để phù hợp với UI
          const formattedMessages = newMessages.map((msg) => ({
            id: msg.messageId,
            content: msg.content,
            structuredData: msg.structuredData, // ⭐ Support structuredData từ API
            senderId: msg.senderId,
            senderName: msg.senderName,
            timestamp: msg.timestamp,
            type: msg.type,
            role: msg.senderId === "ai-assistant" ? "assistant" : "user",
          }));

          // Backend trả về: MỚI → CŨ, reverse để hiển thị CŨ → MỚI (như Messenger)
          const sortedMessages = [...formattedMessages].reverse();

          if (reset) {
            // Reset - load page 0 (messages mới nhất)
            setHistory(sortedMessages);
            setPage(0);
          } else {
            // Load more - thêm messages cũ hơn vào đầu
            setHistory((prev) => {
              const existingIds = new Set(prev.map((msg) => msg.id));
              const newUniqueMessages = sortedMessages.filter(
                (msg) => !existingIds.has(msg.id)
              );
              return [...newUniqueMessages, ...prev];
            });
            setPage(pageNum);
          }

          // Cập nhật total và hasMore
          setTotal(totalCount);
          const totalLoaded = reset
            ? sortedMessages.length
            : history.length + sortedMessages.length;
          setHasMore(totalLoaded < totalCount);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [sessionId, history.length]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadHistory(page + 1, false);
    }
  }, [page, loading, hasMore, loadHistory]);

  const refresh = useCallback(() => {
    setHistory([]);
    setPage(0);
    setTotal(0);
    setHasMore(true);
    loadHistory(0, true);
  }, [loadHistory]);

  return {
    history,
    loading,
    error,
    hasMore,
    total,
    loadMore,
    refresh,
  };
};
