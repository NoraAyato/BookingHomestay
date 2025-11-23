import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { useChatBox, useMessages } from "../../hooks/useChat";
import { useAIChat } from "../../hooks/useAIChat";
import { getImageUrl } from "../../utils/imageUrl";
import { useAuth } from "../../hooks/useAuth";
import HomestayCard from "./HomestayCard";
import {
  parseMultipleHomestaysFromText,
  shouldRenderAsHomestayCards,
  formatHomestayData,
  extractTextBeforeHomestays,
} from "../../utils/homestayParser";
import "./styles/chat.css";

const ChatBox = ({
  hostId,
  homestayId,
  hostName,
  hostAvatar,
  onClose,
  isAIChat = false,
}) => {
  const { user } = useAuth();

  // AI Chat hooks
  const aiChatHooks = useAIChat();

  const {
    conversationId,
    loading: loadingConversation,
    initConversation,
    isFirebaseAuthenticated,
  } = !isAIChat
    ? useChatBox(hostId, homestayId)
    : {
        conversationId: "ai-chat",
        loading: false,
        initConversation: () => {},
        isFirebaseAuthenticated: true,
      };
  const {
    messages,
    loading: loadingMessages,
    sendMessage,
  } = !isAIChat
    ? useMessages(conversationId)
    : {
        messages: aiChatHooks.messages,
        loading: false, // Không dùng loading để ẩn messages
        sendMessage: aiChatHooks.sendMessage,
      };

  // Lấy trạng thái sending riêng cho AI chat
  const isSendingMessage = isAIChat ? aiChatHooks.isSending : false;
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // ⭐ FIX: Sử dụng useCallback để tránh re-create function
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);

  // Auto-scroll khi gửi tin nhắn mới (Regular chat)
  useEffect(() => {
    if (!isAIChat) {
      scrollToBottom();
    }
  }, [messages, isAIChat, scrollToBottom]);

  // ⭐ FIX: Sử dụng useLayoutEffect thay vì useEffect với setTimeout
  // useLayoutEffect chạy đồng bộ sau khi DOM update, đảm bảo scroll chính xác
  useLayoutEffect(() => {
    if (isAIChat && messages.length > 0 && !aiChatHooks.loadingMore) {
      // Chỉ scroll khi:
      // 1. Là AI chat
      // 2. Có messages
      // 3. Không đang load more (tránh scroll khi load history cũ)
      scrollToBottom();
    }
  }, [isAIChat, messages, aiChatHooks.loadingMore, scrollToBottom]);

  // Init conversation khi Firebase đã authenticate
  useEffect(() => {
    if (isFirebaseAuthenticated && !conversationId && !loadingConversation) {
      initConversation();
    }
  }, [
    isFirebaseAuthenticated,
    conversationId,
    loadingConversation,
    initConversation,
  ]);

  // Init AI chat
  useEffect(() => {
    if (isAIChat && !aiChatHooks.initialized) {
      aiChatHooks.initializeChat();
    }
  }, [isAIChat, aiChatHooks.initialized, aiChatHooks.initializeChat]);

  // Không dùng auto-scroll detection nữa, chỉ dùng nút manual để tránh conflict

  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Cấm gửi nếu AI đang suy nghĩ hoặc đang gửi tin nhắn thường
    if (
      !inputMessage.trim() ||
      sending ||
      isSendingMessage ||
      (!conversationId && !isAIChat)
    )
      return;

    // Chỉ set sending cho regular chat, AI chat tự quản lý isSending
    if (!isAIChat) {
      setSending(true);
    }
    const result = await sendMessage(inputMessage.trim());

    if (result.success) {
      setInputMessage("");
    }

    // Chỉ unset sending cho regular chat
    if (!isAIChat) {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-[360px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] overflow-hidden z-50">
      {/* Header - Custom style */}
      <div
        className={`${
          isAIChat
            ? "bg-gradient-to-r from-indigo-600 to-blue-500"
            : "bg-[#2481CC]"
        } text-white px-3 py-2.5 flex items-center justify-between`}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {isAIChat ? (
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden relative group p-1.5">
                <svg
                  className="w-full h-full text-indigo-600 z-10 group-hover:scale-110 transition-transform duration-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="currentColor"
                    className="opacity-20"
                  />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                  <path
                    d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="none"
                  />
                  <circle cx="8" cy="10" r="1" fill="currentColor" />
                  <circle cx="16" cy="10" r="1" fill="currentColor" />
                  <path
                    d="M9 14C9.5 15 10.5 16 12 16C13.5 16 14.5 15 15 14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                {/* Glowing Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-blue-500/20 animate-pulse"></div>
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                {hostAvatar ? (
                  <img
                    src={getImageUrl(hostAvatar)}
                    alt={hostName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-medium text-base">
                    {hostName?.charAt(0)?.toUpperCase() || "H"}
                  </span>
                )}
              </div>
            )}
            {/* Online status */}
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 ${
                isAIChat ? "bg-green-400" : "bg-[#4EC46E]"
              } rounded-full ${
                isAIChat
                  ? "border-2 border-indigo-600"
                  : "border-2 border-[#2481CC]"
              }`}
            >
              {isAIChat && (
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {isAIChat ? (
              <>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-medium text-[14px] truncate leading-tight">
                    AI Assistant
                  </h3>
                  <span className="px-1.5 py-0.5 bg-blue-400/20 rounded-full text-[10px] font-medium">
                    Beta
                  </span>
                </div>
                <p className="text-[12px] text-white/90 leading-tight font-medium">
                  Hỗ trợ đặt phòng
                </p>
              </>
            ) : (
              <>
                <h3 className="font-medium text-[14px] truncate leading-tight">
                  {hostName || "Chủ nhà"}
                </h3>
                <p className="text-[12px] text-white/80 leading-tight">
                  online
                </p>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          {!isAIChat && (
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hover:bg-white/10 p-2 rounded transition-colors"
              title={isMinimized ? "Mở rộng" : "Thu nhỏ"}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMinimized ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                )}
              </svg>
            </button>
          )}
          <button
            onClick={onClose}
            className="hover:bg-white/10 p-2 rounded transition-colors"
            title="Đóng"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages - Telegram style */}
      {!isMinimized && (
        <>
          <div
            ref={messagesContainerRef}
            className="h-[420px] overflow-y-auto px-2.5 py-2 bg-[#0F1419] telegram-pattern"
          >
            {loadingConversation || loadingMessages ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-10 h-10 border-3 border-[#2481CC]/30 border-t-[#2481CC] rounded-full animate-spin"></div>
              </div>
            ) : !conversationId ? (
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
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                  </svg>
                </div>
                <p className="text-white/60 text-sm">Chưa có tin nhắn nào</p>
              </div>
            ) : (
              <div className="space-y-[2px]">
                {/* Load more button cho AI Chat - hiện ở đầu danh sách như Messenger */}
                {isAIChat &&
                  aiChatHooks.hasMoreMessages &&
                  messages.length > 0 && (
                    <div className="flex justify-center py-3 mb-2">
                      <button
                        onClick={() => {
                          const container = messagesContainerRef.current;
                          if (!container) return;

                          // Lưu vị trí scroll hiện tại
                          const previousScrollHeight = container.scrollHeight;
                          const previousScrollTop = container.scrollTop;

                          aiChatHooks.loadMoreMessages().then((result) => {
                            if (result.success && result.loadedCount > 0) {
                              // Restore scroll position để không bị jump
                              setTimeout(() => {
                                const newScrollHeight = container.scrollHeight;
                                const scrollDiff =
                                  newScrollHeight - previousScrollHeight;
                                container.scrollTop =
                                  previousScrollTop + scrollDiff;
                              }, 50);
                            }
                          });
                        }}
                        disabled={aiChatHooks.loadingMore}
                        className="flex items-center gap-2 bg-black/30 hover:bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {aiChatHooks.loadingMore ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span className="text-white/90 text-xs font-medium">
                              Đang tải...
                            </span>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4 text-white/90"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                            <span className="text-white/90 text-xs font-medium">
                              Xem tin nhắn cũ hơn
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                {messages.map((message, index) => {
                  const isMyMessage = isAIChat
                    ? message.isUser
                    : message.senderId === user?.userId;
                  const prevMessage = messages[index - 1];
                  const nextMessage = messages[index + 1];
                  const messageDate = isAIChat
                    ? message.timestamp
                    : message.sentAt;
                  const prevMessageDate = isAIChat
                    ? prevMessage?.timestamp
                    : prevMessage?.sentAt;
                  const showDate =
                    !prevMessage ||
                    new Date(messageDate).toDateString() !==
                      new Date(prevMessageDate).toDateString();
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
                            {new Date(messageDate).toLocaleDateString("vi-VN", {
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
                        {/* Avatar - chỉ hiện ở tin nhắn cuối của group */}
                        {!isMyMessage && (
                          <div className="w-8 h-8 rounded-full flex-shrink-0 mb-0.5">
                            {isGroupEnd &&
                              (isAIChat ? (
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 flex items-center justify-center p-1.5">
                                  <svg
                                    className="w-full h-full text-white"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                      fill="currentColor"
                                      className="opacity-20"
                                    />
                                    <circle
                                      cx="12"
                                      cy="12"
                                      r="3"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z"
                                      stroke="currentColor"
                                      strokeWidth="1"
                                      fill="none"
                                    />
                                    <circle
                                      cx="8"
                                      cy="10"
                                      r="1"
                                      fill="currentColor"
                                    />
                                    <circle
                                      cx="16"
                                      cy="10"
                                      r="1"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M9 14C9.5 15 10.5 16 12 16C13.5 16 14.5 15 15 14"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </div>
                              ) : hostAvatar ? (
                                <img
                                  src={getImageUrl(hostAvatar)}
                                  alt={hostName}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full rounded-full bg-[#2481CC] flex items-center justify-center">
                                  <span className="text-white text-xs font-medium">
                                    {hostName?.charAt(0)?.toUpperCase() || "H"}
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}

                        {/* Message bubble */}
                        <div
                          className={`max-w-[70%] ${
                            isMyMessage ? "ml-auto" : ""
                          }`}
                        >
                          <div
                            className={`px-3 py-2 ${
                              isMyMessage
                                ? "bg-[#2481CC] text-white rounded-l-xl rounded-tr-xl"
                                : "bg-[#182533] text-white rounded-r-xl rounded-tl-xl"
                            } ${
                              isGroupStart && !isMyMessage
                                ? "rounded-tl-sm"
                                : ""
                            } ${
                              isGroupEnd && !isMyMessage ? "rounded-bl-sm" : ""
                            } ${
                              isGroupStart && isMyMessage ? "rounded-tr-sm" : ""
                            } ${
                              isGroupEnd && isMyMessage ? "rounded-br-sm" : ""
                            }`}
                          >
                            {/* ⭐ NEW: Xử lý structuredData từ AI */}
                            {(() => {
                              // Debug log
                              if (isAIChat && !message.isUser && message.id) {
                                console.log("🔍 AI Message:", {
                                  id: message.id,
                                  hasStructuredData: !!message.structuredData,
                                  dataType: message.structuredData?.dataType,
                                  dataCount:
                                    message.structuredData?.data?.length,
                                  hasContent: !!message.content,
                                });
                              }

                              // Render với structuredData
                              if (isAIChat && message.structuredData) {
                                return (
                                  <div>
                                    {/* Reply text */}
                                    {message.structuredData.reply && (
                                      <p className="text-[14.5px] leading-[1.4] break-words whitespace-pre-wrap mb-2">
                                        {message.structuredData.reply}
                                      </p>
                                    )}

                                    {/* Render cards theo dataType */}
                                    {message.structuredData.data?.length >
                                      0 && (
                                      <div className="mt-2 space-y-2">
                                        {message.structuredData.dataType ===
                                          "HOMESTAY_LIST" &&
                                          // Homestay cards
                                          message.structuredData.data.map(
                                            (homestay, index) => (
                                              <HomestayCard
                                                key={homestay.id || index}
                                                homestay={homestay}
                                              />
                                            )
                                          )}

                                        {message.structuredData.dataType ===
                                          "AMENITIES_LIST" &&
                                          // Amenities cards (dùng HomestayCard vì structure giống nhau)
                                          message.structuredData.data.map(
                                            (item, index) => (
                                              <HomestayCard
                                                key={item.id || index}
                                                homestay={item}
                                              />
                                            )
                                          )}

                                        {message.structuredData.dataType ===
                                          "POLICY_INFO" &&
                                          // Policy info cards (dùng HomestayCard vì structure giống nhau)
                                          message.structuredData.data.map(
                                            (item, index) => (
                                              <HomestayCard
                                                key={item.id || index}
                                                homestay={item}
                                              />
                                            )
                                          )}

                                        {/* Thêm các dataType khác ở đây nếu cần */}
                                      </div>
                                    )}
                                  </div>
                                );
                              }

                              // Fallback: Render với content text
                              const messageText =
                                message.content || message.message;
                              const shouldRenderCards =
                                shouldRenderAsHomestayCards(messageText);
                              const homestays = shouldRenderCards
                                ? parseMultipleHomestaysFromText(
                                    messageText
                                  ).map(formatHomestayData)
                                : [];
                              const textBeforeHomestays = shouldRenderCards
                                ? extractTextBeforeHomestays(messageText)
                                : messageText;

                              return (
                                <div>
                                  {/* Text content trước homestay cards hoặc toàn bộ text nếu không có homestays */}
                                  {textBeforeHomestays && (
                                    <p className="text-[14.5px] leading-[1.4] break-words whitespace-pre-wrap mb-2">
                                      {textBeforeHomestays}
                                    </p>
                                  )}

                                  {/* Homestay cards */}
                                  {shouldRenderCards &&
                                    homestays.length > 0 && (
                                      <div className="mt-2 space-y-2">
                                        {homestays.map((homestay, index) => (
                                          <HomestayCard
                                            key={homestay.id || index}
                                            homestay={homestay}
                                          />
                                        ))}
                                      </div>
                                    )}

                                  {/* AI thinking animation */}
                                  {isAIChat && message.isThinking && (
                                    <span className="ai-thinking-dots">
                                      <span className="ai-thinking-dot"></span>
                                      <span className="ai-thinking-dot"></span>
                                      <span className="ai-thinking-dot"></span>
                                    </span>
                                  )}
                                </div>
                              );
                            })()}

                            {/* Time and status */}
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <span
                                className={`text-[11px] ${
                                  isMyMessage
                                    ? "text-white/70"
                                    : "text-white/50"
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

          {/* Input - Telegram style */}
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
                  disabled={false} // Luôn cho phép nhập
                />
              </div>
              <button
                type="submit"
                disabled={
                  !inputMessage.trim() ||
                  sending ||
                  isSendingMessage ||
                  (!conversationId && !isAIChat)
                }
                className="w-8 h-8 bg-[#2481CC] text-white rounded-full flex items-center justify-center hover:bg-[#1f73b7] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                title="Gửi"
              >
                {sending || isSendingMessage ? (
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
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatBox;
