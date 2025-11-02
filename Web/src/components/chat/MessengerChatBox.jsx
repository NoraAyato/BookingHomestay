import { useState, useEffect, useRef } from "react";
import { useMessages } from "../../hooks/useChat";
import { getImageUrl } from "../../utils/imageUrl";
import { useAuth } from "../../hooks/useAuth";

const MessengerChatBox = ({ conversation, onBack }) => {
  const { user } = useAuth();
  const { messages, loading, sendMessage, markAsRead } = useMessages(
    conversation.conversationId
  );
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);

  // Helper function để lấy unreadCount dựa trên role
  const getUnreadCount = () => {
    const isHost = user?.userId === conversation.hostId;
    return isHost
      ? conversation.unreadCountForHost || 0
      : conversation.unreadCountForUser || 0;
  };

  const getOtherParticipant = () => {
    const isHost = user?.userId === conversation.hostId;

    if (isHost) {
      return {
        name: conversation.userName || "Người dùng",
        avatar: conversation.userAvatar,
        id: conversation.userId,
      };
    } else {
      return {
        name: conversation.hostName || "Chủ nhà",
        avatar: conversation.hostAvatar,
        id: conversation.hostId,
      };
    }
  };

  const otherParticipant = getOtherParticipant();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Tự động đánh dấu đã đọc khi mở conversation
  useEffect(() => {
    const markConversationAsRead = async () => {
      const unreadCount = getUnreadCount();
      console.log("=== Checking mark as read ===");
      console.log("conversationId:", conversation.conversationId);
      console.log("unreadCount:", unreadCount);

      if (conversation.conversationId && unreadCount > 0) {
        console.log("Calling markAsRead...");
        const response = await markAsRead();
        console.log("Mark as read response:", response);
      } else {
        console.log("Skip marking: no unread or no conversationId");
      }
    };

    markConversationAsRead();
  }, [
    conversation.conversationId,
    conversation.unreadCountForHost,
    conversation.unreadCountForUser,
    markAsRead,
    user?.userId,
  ]);

  // Đánh dấu đã đọc khi nhận tin nhắn mới từ đối phương
  useEffect(() => {
    // Bỏ qua lần render đầu tiên hoặc khi đang loading
    if (loading || messages.length === 0) {
      prevMessagesLengthRef.current = messages.length;
      return;
    }

    // Kiểm tra có tin nhắn mới không
    if (messages.length > prevMessagesLengthRef.current) {
      const latestMessage = messages[messages.length - 1];

      // Kiểm tra tin nhắn mới có phải từ đối phương không (không phải từ mình)
      if (latestMessage.senderId !== user?.userId) {
        console.log("=== New message from other user ===");
        console.log("Latest message:", latestMessage);
        console.log("Calling markAsRead for new message...");

        markAsRead().then((response) => {
          console.log("Mark as read response (new message):", response);
        });
      }
    }

    // Cập nhật số lượng tin nhắn trước đó
    prevMessagesLengthRef.current = messages.length;
  }, [messages, loading, user?.userId, markAsRead]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || sending || !conversation.conversationId) return;

    setSending(true);
    const result = await sendMessage(inputMessage.trim());

    if (result.success) {
      setInputMessage("");
    }
    setSending(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages - Không cần header nữa */}
      <div className="flex-1 overflow-y-auto px-2.5 py-2 bg-[#0F1419] telegram-pattern">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-10 h-10 border-3 border-[#2481CC]/30 border-t-[#2481CC] rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-16 h-16 bg-[#2481CC]/10 rounded-full flex items-center justify-center mb-3">
              <svg
                className="w-8 h-8 text-[#2481CC]/50"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
              </svg>
            </div>
            <p className="text-white/60 text-sm">Chưa có tin nhắn nào</p>
            <p className="text-white/40 text-xs mt-1">
              Gửi tin nhắn để bắt đầu trò chuyện
            </p>
          </div>
        ) : (
          <div className="space-y-[2px]">
            {messages.map((message, index) => {
              const isMyMessage = message.senderId === user?.userId;
              const prevMessage = messages[index - 1];
              const nextMessage = messages[index + 1];
              const showDate =
                !prevMessage ||
                new Date(message.sentAt).toDateString() !==
                  new Date(prevMessage.sentAt).toDateString();
              const isGroupStart =
                !prevMessage || prevMessage.senderId !== message.senderId;
              const isGroupEnd =
                !nextMessage || nextMessage.senderId !== message.senderId;

              return (
                <div key={message.id}>
                  {/* Date divider */}
                  {showDate && (
                    <div className="flex items-center justify-center my-4">
                      <span className="bg-[#2B5278]/80 backdrop-blur-sm text-white/90 text-xs px-3 py-1 rounded-full">
                        {new Date(message.sentAt).toLocaleDateString("vi-VN", {
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>
                  )}

                  <div
                    className={`flex items-end gap-1.5 ${
                      isMyMessage ? "justify-end" : "justify-start"
                    } ${isGroupStart ? "mt-2" : "mt-0.5"}`}
                  >
                    {/* Avatar */}
                    {!isMyMessage && (
                      <div className="w-8 h-8 rounded-full flex-shrink-0 mb-0.5">
                        {isGroupEnd && otherParticipant.avatar ? (
                          <img
                            src={getImageUrl(otherParticipant.avatar)}
                            alt={otherParticipant.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : isGroupEnd ? (
                          <div className="w-full h-full rounded-full bg-[#2481CC] flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {otherParticipant.name
                                ?.charAt(0)
                                ?.toUpperCase() || "?"}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    )}

                    {/* Message bubble */}
                    <div
                      className={`max-w-[70%] ${isMyMessage ? "ml-auto" : ""}`}
                    >
                      <div
                        className={`px-3 py-2 ${
                          isMyMessage
                            ? "bg-[#2481CC] text-white rounded-l-xl rounded-tr-xl"
                            : "bg-[#182533] text-white rounded-r-xl rounded-tl-xl"
                        } ${
                          isGroupStart && !isMyMessage ? "rounded-tl-sm" : ""
                        } ${
                          isGroupEnd && !isMyMessage ? "rounded-bl-sm" : ""
                        } ${
                          isGroupStart && isMyMessage ? "rounded-tr-sm" : ""
                        } ${isGroupEnd && isMyMessage ? "rounded-br-sm" : ""}`}
                      >
                        <p className="text-[14.5px] leading-[1.4] break-words whitespace-pre-wrap">
                          {message.content || message.message}
                        </p>

                        {/* Time and status */}
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span
                            className={`text-[11px] ${
                              isMyMessage ? "text-white/70" : "text-white/50"
                            }`}
                          >
                            {new Date(
                              message.sentAt || message.timestamp
                            ).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {isMyMessage && (
                            <span className="ml-0.5">
                              {message.isRead ? (
                                <svg
                                  className="w-4 h-4 text-white/70"
                                  viewBox="0 0 18 13"
                                  fill="none"
                                >
                                  <path
                                    d="M6 10.2L1.8 6L0.4 7.4L6 13L18 1L16.6-0.4L6 10.2Z"
                                    fill="currentColor"
                                  />
                                  <path
                                    d="M11 10.2L6.8 6L5.4 7.4L11 13L23 1L21.6-0.4L11 10.2Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="w-4 h-4 text-white/50"
                                  viewBox="0 0 12 10"
                                  fill="none"
                                >
                                  <path
                                    d="M4 7.4L1.4 4.8L0 6.2L4 10.2L12 2.2L10.6 0.8L4 7.4Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="px-2.5 py-2 bg-white border-t border-gray-200"
      >
        <div className="flex items-end gap-1.5">
          <div className="flex-1 bg-white border border-gray-300 rounded-full px-3 py-1.5 focus-within:border-[#2481CC] transition-colors">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Nhắn tin..."
              className="w-full text-[14px] outline-none bg-transparent placeholder:text-gray-400"
              disabled={sending || !conversation.conversationId}
            />
          </div>
          <button
            type="submit"
            disabled={
              !inputMessage.trim() || sending || !conversation.conversationId
            }
            className="w-8 h-8 bg-[#2481CC] text-white rounded-full flex items-center justify-center hover:bg-[#1f73b7] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            title="Gửi"
          >
            {sending ? (
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessengerChatBox;
